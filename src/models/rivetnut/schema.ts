import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  boreDiameter: positiveLength.default(6),
  bodyDiameter: positiveLength.default(9),
  bodyLength: positiveLength.default(14),
  flangeDiameter: positiveLength.default(12),
  flangeThickness: positiveLength.default(1.5),
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
      (p.bodyDiameter - p.boreDiameter - p.bodyDiameter * 0.045) / 2,
      (p.flangeDiameter - p.bodyDiameter) / 2,
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
      p.boreDiameter < p.bodyDiameter &&
      p.bodyDiameter < p.flangeDiameter &&
      p.flangeThickness < p.bodyLength
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid rivetnut dimensions: mating features must fit within the body",
    })
}
export const rivetNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rivetNutModelDefinitionSchema = z
  .object({ fn: z.literal("rivetnut"), ...shape })
  .strict()
  .superRefine(validate)
export type RivetNutModelPropsInput = z.input<typeof rivetNutModelPropsSchema>
export type RivetNutModelProps = z.output<typeof rivetNutModelPropsSchema>
export type RivetNutModelDefinition = z.output<
  typeof rivetNutModelDefinitionSchema
>
export function getRivetNutDimensions(input: RivetNutModelPropsInput = {}) {
  return rivetNutModelPropsSchema.parse(input)
}
