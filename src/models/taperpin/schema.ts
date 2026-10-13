import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  largeDiameter: positiveLength.default(6),
  smallDiameter: positiveLength.default(5),
  length: positiveLength.default(30),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![(p.largeDiameter - p.smallDiameter) / 2].every(
      (gap) => gap >= extent * 0.0001,
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Material and clearance gaps must exceed 0.0001 times the model envelope",
    })
  if (Object.values(p).some((value) => value < extent * 0.0001))
    ctx.addIssue({
      code: "custom",
      message:
        "Dimensions are too small relative to the model envelope for stable geometry",
    })
  if (!(p.smallDiameter < p.largeDiameter))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid taperpin dimensions: mating features must fit within the body",
    })
}
export const taperPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const taperPinModelDefinitionSchema = z
  .object({ fn: z.literal("taperpin"), ...shape })
  .strict()
  .superRefine(validate)
export type TaperPinModelPropsInput = z.input<typeof taperPinModelPropsSchema>
export type TaperPinModelProps = z.output<typeof taperPinModelPropsSchema>
export type TaperPinModelDefinition = z.output<
  typeof taperPinModelDefinitionSchema
>
export function getTaperPinDimensions(input: TaperPinModelPropsInput = {}) {
  return taperPinModelPropsSchema.parse(input)
}
