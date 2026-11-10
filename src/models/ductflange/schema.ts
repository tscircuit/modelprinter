import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
  holeCount: z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),
  holeDiameter: positiveLength,
  pitchCircleDiameter: positiveLength,
  clockAngle: z.number().finite().nonnegative().lt(360).default(0),
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function layout(props: ResolvedProps) {
  const boreRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const pitchRadius = props.pitchCircleDiameter / 2
  const holeRadius = props.holeDiameter / 2
  return {
    boreRadius,
    outerRadius,
    pitchRadius,
    holeRadius,
    innerWeb: pitchRadius - boreRadius - holeRadius,
    outerWeb: outerRadius - pitchRadius - holeRadius,
    anglePitch: 360 / props.holeCount,
  }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  for (const key of [
    "innerDiameter",
    "outerDiameter",
    "holeDiameter",
    "pitchCircleDiameter",
  ] as const) {
    const radius = props[key] / 2
    if (radius <= 0 || 2 * radius !== props[key])
      issue(key, "Diameter must have a positive, representable radius")
  }
  const dimensions = layout(props)
  // Allow for rounding in the Cartesian hole positions at the ring's scale.
  const margin = Math.max(
    2 * Number.MIN_VALUE,
    8 * Number.EPSILON * dimensions.outerRadius,
  )
  if (!(dimensions.innerWeb > margin && dimensions.outerWeb > margin))
    issue(
      "pitchCircleDiameter",
      "The bolt holes must leave material at both ring edges",
    )
  if (props.holeCount > 1) {
    // A full turn can round at each center and at the wrap back to the first hole.
    const angle = Math.max(0, dimensions.anglePitch - 8 * Number.EPSILON * 360)
    const chord = props.pitchCircleDiameter * Math.sin((angle * Math.PI) / 360)
    if (!(chord - props.holeDiameter > 2 * margin))
      issue(
        "holeCount",
        "Adjacent bolt holes must leave material between their edges",
      )
  }
}

export const ductFlangeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const ductFlangeModelDefinitionSchema = z
  .object({ fn: z.literal("ductflange"), ...shape })
  .strict()
  .superRefine(validate)

export type DuctFlangeModelPropsInput = z.input<
  typeof ductFlangeModelPropsSchema
>
export type DuctFlangeModelProps = z.output<typeof ductFlangeModelPropsSchema>
export type DuctFlangeModelDefinition = z.output<
  typeof ductFlangeModelDefinitionSchema
>

/** Ring centered on XY. Hole 0 is clocked from +X about +Z. Lengths are in millimeters. */
export function getDuctFlangeDimensions(input: DuctFlangeModelPropsInput) {
  const props = ductFlangeModelPropsSchema.parse(input)
  const dimensions = layout(props)
  const r = dimensions.outerRadius
  return {
    ...props,
    ...dimensions,
    size: [props.outerDiameter, props.outerDiameter, props.thickness] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-r, -r, 0] as [number, number, number],
      max: [r, r, props.thickness] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.thickness,
  }
}
