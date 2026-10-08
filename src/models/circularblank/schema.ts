import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine((value) => value > 0)

const shape = {
  /** Overall XY diameter, centered on X=Y=0. */
  diameter: positiveLength.refine(
    (value) => value / 2 > 0,
    "Diameter must have a representable positive radius",
  ),
  /** Overall Z dimension, measured upward from the bottom face at Z=0. */
  thickness: positiveLength,
  /** Uniform round-over of the top and bottom circular outside rims. */
  rimRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (2 * props.rimRadius >= Math.min(props.diameter, props.thickness))
    context.addIssue({
      code: "custom",
      path: ["rimRadius"],
      message:
        "Rim radius must leave positive flat faces and a straight sidewall",
    })
}

export const circularBlankModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const circularBlankModelDefinitionSchema = z
  .object({ fn: z.literal("circularblank"), ...shape })
  .strict()
  .superRefine(validate)

export type CircularBlankModelPropsInput = z.input<
  typeof circularBlankModelPropsSchema
>
export type CircularBlankModelProps = z.output<
  typeof circularBlankModelPropsSchema
>
export type CircularBlankModelDefinition = z.output<
  typeof circularBlankModelDefinitionSchema
>

export function getCircularBlankDimensions(
  input: CircularBlankModelPropsInput,
) {
  const props = circularBlankModelPropsSchema.parse(input)
  const radius = props.diameter / 2
  return {
    diameter: props.diameter,
    thickness: props.thickness,
    rimRadius: props.rimRadius,
    radius,
    flatFaceDiameter: props.diameter - 2 * props.rimRadius,
    straightWallHeight: props.thickness - 2 * props.rimRadius,
    minX: -radius,
    maxX: radius,
    minY: -radius,
    maxY: radius,
    minZ: 0,
    maxZ: props.thickness,
  }
}
