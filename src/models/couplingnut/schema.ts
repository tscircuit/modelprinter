import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  boreDiameter: positiveLength.default(6),
  acrossFlats: positiveLength.default(10),
  height: positiveLength.default(18),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![(p.acrossFlats - p.boreDiameter) / 2].every(
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
  if (!(p.boreDiameter < p.acrossFlats && p.height > p.acrossFlats))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid couplingnut dimensions: mating features must fit within the body",
    })
}
export const couplingNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const couplingNutModelDefinitionSchema = z
  .object({ fn: z.literal("couplingnut"), ...shape })
  .strict()
  .superRefine(validate)
export type CouplingNutModelPropsInput = z.input<
  typeof couplingNutModelPropsSchema
>
export type CouplingNutModelProps = z.output<typeof couplingNutModelPropsSchema>
export type CouplingNutModelDefinition = z.output<
  typeof couplingNutModelDefinitionSchema
>
export function getCouplingNutDimensions(
  input: CouplingNutModelPropsInput = {},
) {
  return couplingNutModelPropsSchema.parse(input)
}
