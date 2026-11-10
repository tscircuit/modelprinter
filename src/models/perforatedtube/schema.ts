import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const count = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER)
const shape = {
  outerDiameter: positiveLength,
  wallThickness: positiveLength,
  length: positiveLength,
  holeDiameter: positiveLength,
  axialPitch: positiveLength,
  rowCount: count,
  endOffset: positiveLength,
  holesAround: count,
  staggerAngle: z.number().finite().nonnegative().default(0),
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function layout(props: ResolvedProps) {
  const outerRadius = props.outerDiameter / 2
  const innerDiameter = 2 * (outerRadius - props.wallThickness)
  const holeRadius = props.holeDiameter / 2
  const lastRowZ = props.endOffset + (props.rowCount - 1) * props.axialPitch
  return {
    outerRadius,
    innerDiameter,
    holeRadius,
    firstRowZ: props.endOffset,
    lastRowZ,
    firstEndMargin: props.endOffset - holeRadius,
    lastEndMargin: props.length - lastRowZ - holeRadius,
    anglePitch: 360 / props.holesAround,
    totalHoles: props.rowCount * props.holesAround,
  }
}

function leavesWeb(spacing: number, holeDiameter: number) {
  // A rounded-up spacing must not admit touching holes.
  const roundoff = Math.max(
    2 * Number.MIN_VALUE,
    8 * Number.EPSILON * holeDiameter,
  )
  return spacing - holeDiameter > roundoff
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const dimensions = layout(props)
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  if (
    dimensions.outerRadius <= 0 ||
    2 * dimensions.outerRadius !== props.outerDiameter
  )
    issue(
      "outerDiameter",
      "Outside diameter must have a positive, representable radius",
    )
  if (
    dimensions.innerDiameter <= 0 ||
    dimensions.innerDiameter >= props.outerDiameter
  )
    issue(
      "wallThickness",
      "Wall thickness must leave a positive bore and a distinct wall",
    )
  if (
    dimensions.holeRadius <= 0 ||
    2 * dimensions.holeRadius !== props.holeDiameter ||
    props.holeDiameter >= dimensions.innerDiameter
  )
    issue(
      "holeDiameter",
      "A radial hole must have a representable radius smaller than the bore radius",
    )
  if (dimensions.firstEndMargin <= 0)
    issue("endOffset", "The first row must leave material before the end")
  // Row coordinates are formed by a multiplication and an addition. Account
  // for rounding at both centers when comparing their axial separation.
  const axialRoundoff =
    4 * Number.EPSILON * Math.max(dimensions.lastRowZ, dimensions.holeRadius)
  if (!(dimensions.lastEndMargin > axialRoundoff))
    issue("length", "The last row must leave material before the far end")
  if (props.rowCount > 1 && props.axialPitch <= axialRoundoff)
    issue("axialPitch", "The axial pitch must keep successive rows distinct")
  if (!Number.isSafeInteger(dimensions.totalHoles))
    issue("holesAround", "The total hole count must be a safe integer")
  if (props.staggerAngle >= dimensions.anglePitch) {
    issue(
      "staggerAngle",
      "The stagger must be less than one circumferential pitch",
    )
    return
  }
  if (dimensions.innerDiameter <= props.holeDiameter) return

  // Angular centers use a division, multiplication and phase addition within
  // one full turn. Bound the gap loss between any two rounded centers.
  const angularRoundoff = 8 * Number.EPSILON * 360
  const boreChord = (angle: number) =>
    dimensions.innerDiameter *
    Math.sin((Math.max(0, angle - angularRoundoff) * Math.PI) / 360)
  if (
    props.holesAround > 1 &&
    !leavesWeb(boreChord(dimensions.anglePitch), props.holeDiameter)
  )
    issue(
      "holesAround",
      "Holes in a row must leave material between their edges",
    )

  // At the bore, the midpoint between adjacent radial axes determines
  // whether the circular holes meet. The bore is the smallest wall radius.
  if (props.rowCount > 1) {
    const offset = Math.min(
      props.staggerAngle,
      dimensions.anglePitch - props.staggerAngle,
    )
    const minPitch = Math.max(0, props.axialPitch - axialRoundoff)
    if (!leavesWeb(Math.hypot(minPitch, boreChord(offset)), props.holeDiameter))
      issue(
        "axialPitch",
        "Adjacent rows must leave material between their holes",
      )
  }
  if (
    props.rowCount > 2 &&
    !leavesWeb(2 * props.axialPitch - axialRoundoff, props.holeDiameter)
  )
    issue(
      "axialPitch",
      "Rows two pitches apart share an angle and must remain separate",
    )
}

export const perforatedTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const perforatedTubeModelDefinitionSchema = z
  .object({ fn: z.literal("perforatedtube"), ...shape })
  .strict()
  .superRefine(validate)

export type PerforatedTubeModelPropsInput = z.input<
  typeof perforatedTubeModelPropsSchema
>
export type PerforatedTubeModelProps = z.output<
  typeof perforatedTubeModelPropsSchema
>
export type PerforatedTubeModelDefinition = z.output<
  typeof perforatedTubeModelDefinitionSchema
>

/** Round stock centered on XY, with Z=0..length. Holes are radial through
 * the near wall. Odd-indexed rows use the stagger in degrees.
 */
export function getPerforatedTubeDimensions(
  input: PerforatedTubeModelPropsInput,
) {
  const props = perforatedTubeModelPropsSchema.parse(input)
  const dimensions = layout(props)
  const r = dimensions.outerRadius
  return {
    ...props,
    ...dimensions,
    size: [props.outerDiameter, props.outerDiameter, props.length] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-r, -r, 0] as [number, number, number],
      max: [r, r, props.length] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
