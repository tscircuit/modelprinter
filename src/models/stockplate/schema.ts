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
  /** Overall X dimension, centered on X=0. */
  length: positiveLength,
  /** Overall Y dimension, centered on Y=0. */
  width: positiveLength,
  /** Overall Z dimension; the bottom mounting datum is Z=0. */
  thickness: positiveLength,
  /** Uniform round-over of all twelve outside edges, without changing the envelope. */
  edgeRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (
    props.edgeRadius >=
    Math.min(props.length, props.width, props.thickness) / 2
  )
    context.addIssue({
      code: "custom",
      path: ["edgeRadius"],
      message: "Edge radius must leave positive flat portions on all six faces",
    })
}

export const stockPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const stockPlateModelDefinitionSchema = z
  .object({ fn: z.literal("stockplate"), ...shape })
  .strict()
  .superRefine(validate)

export type StockPlateModelPropsInput = z.input<
  typeof stockPlateModelPropsSchema
>
export type StockPlateModelProps = z.output<typeof stockPlateModelPropsSchema>
export type StockPlateModelDefinition = z.output<
  typeof stockPlateModelDefinitionSchema
>

export function getStockPlateDimensions(input: StockPlateModelPropsInput) {
  const props = stockPlateModelPropsSchema.parse(input)
  return {
    length: props.length,
    width: props.width,
    thickness: props.thickness,
    edgeRadius: props.edgeRadius,
    minX: -props.length / 2,
    maxX: props.length / 2,
    minY: -props.width / 2,
    maxY: props.width / 2,
    minZ: 0,
    maxZ: props.thickness,
  }
}
