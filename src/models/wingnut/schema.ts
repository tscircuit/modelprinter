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
  wingSpan: positiveLength.default(28),
  wingHeight: positiveLength.default(10),
  wingThickness: positiveLength.default(3),
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
      (p.acrossFlats - p.boreDiameter) / 2,
      (p.wingSpan - p.acrossFlats) / 2,
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
      p.boreDiameter < p.acrossFlats &&
      p.acrossFlats < p.wingSpan &&
      p.wingThickness < p.acrossFlats &&
      p.bodyHeight < p.wingHeight
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid wingnut dimensions: mating features must fit within the body",
    })
}
export const wingNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const wingNutModelDefinitionSchema = z
  .object({ fn: z.literal("wingnut"), ...shape })
  .strict()
  .superRefine(validate)
export type WingNutModelPropsInput = z.input<typeof wingNutModelPropsSchema>
export type WingNutModelProps = z.output<typeof wingNutModelPropsSchema>
export type WingNutModelDefinition = z.output<
  typeof wingNutModelDefinitionSchema
>
export function getWingNutDimensions(input: WingNutModelPropsInput = {}) {
  return wingNutModelPropsSchema.parse(input)
}
