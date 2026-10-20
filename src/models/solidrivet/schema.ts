import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  shaftDiameter: positiveLength.default(4),
  shaftLength: positiveLength.default(12),
  headDiameter: positiveLength.default(8),
  headHeight: positiveLength.default(2.5),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![(p.headDiameter - p.shaftDiameter) / 2].every(
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
  if (!(p.shaftDiameter < p.headDiameter && p.headHeight < p.headDiameter / 2))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid solidrivet dimensions: mating features must fit within the body",
    })
}
export const solidRivetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const solidRivetModelDefinitionSchema = z
  .object({ fn: z.literal("solidrivet"), ...shape })
  .strict()
  .superRefine(validate)
export type SolidRivetModelPropsInput = z.input<
  typeof solidRivetModelPropsSchema
>
export type SolidRivetModelProps = z.output<typeof solidRivetModelPropsSchema>
export type SolidRivetModelDefinition = z.output<
  typeof solidRivetModelDefinitionSchema
>
export function getSolidRivetDimensions(input: SolidRivetModelPropsInput = {}) {
  return solidRivetModelPropsSchema.parse(input)
}
