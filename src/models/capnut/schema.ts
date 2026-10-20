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
  bodyHeight: positiveLength.default(5),
  capHeight: positiveLength.default(5),
  wallThickness: positiveLength.default(1),
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
      (p.acrossFlats - p.boreDiameter) / 2 - p.wallThickness,
      p.bodyHeight - p.wallThickness,
      p.capHeight - p.wallThickness,
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
      p.boreDiameter + 2 * p.wallThickness < p.acrossFlats &&
      p.wallThickness < p.bodyHeight &&
      p.wallThickness < p.capHeight
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid capnut dimensions: mating features must fit within the body",
    })
}
export const capNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const capNutModelDefinitionSchema = z
  .object({ fn: z.literal("capnut"), ...shape })
  .strict()
  .superRefine(validate)
export type CapNutModelPropsInput = z.input<typeof capNutModelPropsSchema>
export type CapNutModelProps = z.output<typeof capNutModelPropsSchema>
export type CapNutModelDefinition = z.output<typeof capNutModelDefinitionSchema>
export function getCapNutDimensions(input: CapNutModelPropsInput = {}) {
  return capNutModelPropsSchema.parse(input)
}
