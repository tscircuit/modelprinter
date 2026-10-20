import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  innerDiameter: positiveLength.default(16),
  outerDiameter: positiveLength.default(20),
  thickness: positiveLength.default(1.2),
  gapWidth: positiveLength.default(5),
  lugDiameter: positiveLength.default(4),
  holeDiameter: positiveLength.default(1.5),
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
      (p.outerDiameter - p.innerDiameter) / 2,
      (p.lugDiameter - p.holeDiameter) / 2,
      (p.gapWidth - p.lugDiameter) / 2,
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
      p.innerDiameter < p.outerDiameter &&
      p.gapWidth < p.innerDiameter &&
      p.gapWidth > p.lugDiameter &&
      p.holeDiameter < p.lugDiameter &&
      p.lugDiameter < p.innerDiameter / 2
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid retainingring dimensions: mating features must fit within the body",
    })
}
export const retainingRingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const retainingRingModelDefinitionSchema = z
  .object({ fn: z.literal("retainingring"), ...shape })
  .strict()
  .superRefine(validate)
export type RetainingRingModelPropsInput = z.input<
  typeof retainingRingModelPropsSchema
>
export type RetainingRingModelProps = z.output<
  typeof retainingRingModelPropsSchema
>
export type RetainingRingModelDefinition = z.output<
  typeof retainingRingModelDefinitionSchema
>
export function getRetainingRingDimensions(
  input: RetainingRingModelPropsInput = {},
) {
  return retainingRingModelPropsSchema.parse(input)
}
