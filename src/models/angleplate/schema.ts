import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive,
  height: positive,
  depth: positive,
  thickness: positive,
  innerRadius: nonnegative,
  baseHoleCount: z.literal(4),
  holeDiameter: positive,
  basePitchX: positive,
  basePitchY: positive,
  faceHoleCount: z.literal(2),
  facePitch: positive,
  faceHeight: positive,
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const largestDimension = Math.max(
    ...Object.values(props).filter(
      (value): value is number => typeof value === "number",
    ),
  )
  if (!Number.isFinite((4 * largestDimension) ** 3)) {
    issue(
      "Dimensions must permit finite derived coordinates and volume",
      "width",
    )
    return
  }

  const cornerExtent = props.thickness + props.innerRadius
  if (cornerExtent >= props.depth || cornerExtent >= props.height) {
    issue(
      "The inside corner must leave a straight base and upright face",
      "innerRadius",
    )
  }
  if (
    props.basePitchX <= props.holeDiameter ||
    props.basePitchY <= props.holeDiameter
  ) {
    issue("Base hole pitches must leave material between holes", "holeDiameter")
  }
  if (props.basePitchX + props.holeDiameter >= props.width) {
    issue("Base holes must leave material at both side edges", "basePitchX")
  }
  if (props.basePitchY + props.holeDiameter >= props.depth - cornerExtent) {
    issue("Base holes must fit wholly within the straight base", "basePitchY")
  }
  if (props.facePitch <= props.holeDiameter) {
    issue("Face hole pitch must leave material between holes", "facePitch")
  }
  if (props.facePitch + props.holeDiameter >= props.width) {
    issue("Face holes must leave material at both side edges", "facePitch")
  }
  if (props.faceHeight - props.holeDiameter / 2 <= cornerExtent) {
    issue("Face holes must lie above the inside corner", "faceHeight")
  }
  if (props.faceHeight + props.holeDiameter / 2 >= props.height) {
    issue("Face holes must leave material at the top edge", "faceHeight")
  }
}

/**
 * Right-angle mounting plate in a right-handed local frame, in millimeters:
 * X spans -width/2..width/2, Y spans 0..depth, and Z spans 0..height.
 * The base occupies Z=0..thickness and the upright occupies Y=0..thickness.
 * innerRadius is the concave YZ fillet joining their inside faces; outside
 * edges are square. Four circular through-base bores run along Z, centered
 * on X=0 and the straight base interval Y=thickness+innerRadius..depth.
 * Two circular through-face bores run along Y at X=+-facePitch/2,
 * Z=faceHeight. All dimensions and the fixed 4/2 hole counts are required.
 */
export const anglePlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const anglePlateModelDefinitionSchema = z
  .object({ fn: z.literal("angleplate"), ...shape })
  .strict()
  .superRefine(validate)

export type AnglePlateModelPropsInput = z.input<
  typeof anglePlateModelPropsSchema
>
export type AnglePlateModelProps = z.output<typeof anglePlateModelPropsSchema>
export type AnglePlateModelDefinition = z.output<
  typeof anglePlateModelDefinitionSchema
>

export function getAnglePlateDimensions(input: AnglePlateModelPropsInput) {
  const props = anglePlateModelPropsSchema.parse(input)
  const baseCenterY = (props.thickness + props.innerRadius + props.depth) / 2
  const baseHoleCenters = [-1, 1].flatMap((xSign) =>
    [-1, 1].map(
      (ySign) =>
        [
          (xSign * props.basePitchX) / 2,
          baseCenterY + (ySign * props.basePitchY) / 2,
          props.thickness / 2,
        ] as [number, number, number],
    ),
  )
  const faceHoleCenters = [-1, 1].map(
    (xSign) =>
      [
        (xSign * props.facePitch) / 2,
        props.thickness / 2,
        props.faceHeight,
      ] as [number, number, number],
  )
  return {
    ...props,
    size: [props.width, props.depth, props.height] as [number, number, number],
    baseHoleCenters,
    faceHoleCenters,
  }
}
