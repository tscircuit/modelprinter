import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  rodDiameter: positiveLength.default(6),
  legSpacing: positiveLength.default(30),
  legLength: positiveLength.default(35),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (![p.legSpacing - p.rodDiameter].every((gap) => gap >= extent * 0.0001))
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
  if (!(p.rodDiameter < p.legSpacing))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid ubolt dimensions: mating features must fit within the body",
    })
}
export const uBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const uBoltModelDefinitionSchema = z
  .object({ fn: z.literal("ubolt"), ...shape })
  .strict()
  .superRefine(validate)
export type UBoltModelPropsInput = z.input<typeof uBoltModelPropsSchema>
export type UBoltModelProps = z.output<typeof uBoltModelPropsSchema>
export type UBoltModelDefinition = z.output<typeof uBoltModelDefinitionSchema>
export function getUBoltDimensions(input: UBoltModelPropsInput = {}) {
  return uBoltModelPropsSchema.parse(input)
}
