import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  boreDiameter: positiveLength.default(6),
  baseWidth: positiveLength.default(16),
  length: positiveLength.default(20),
  baseHeight: positiveLength.default(4),
  neckWidth: positiveLength.default(10),
  neckHeight: positiveLength.default(4),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![
      (p.neckWidth - p.boreDiameter) / 2,
      (p.length - p.boreDiameter) / 2,
      (p.baseWidth - p.neckWidth) / 2,
    ].every((gap) => gap >= extent * 0.0001)
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
  if (
    !(
      p.boreDiameter < p.neckWidth &&
      p.neckWidth < p.baseWidth &&
      p.boreDiameter < p.length
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid tslotnut dimensions: mating features must fit within the body",
    })
}
export const tSlotNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const tSlotNutModelDefinitionSchema = z
  .object({ fn: z.literal("tslotnut"), ...shape })
  .strict()
  .superRefine(validate)
export type TSlotNutModelPropsInput = z.input<typeof tSlotNutModelPropsSchema>
export type TSlotNutModelProps = z.output<typeof tSlotNutModelPropsSchema>
export type TSlotNutModelDefinition = z.output<
  typeof tSlotNutModelDefinitionSchema
>
export function getTSlotNutDimensions(input: TSlotNutModelPropsInput = {}) {
  return tSlotNutModelPropsSchema.parse(input)
}
