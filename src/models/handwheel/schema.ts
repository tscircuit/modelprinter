import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  outerDiameter: positiveLength.default(100),
  rimWidth: positiveLength.default(12),
  hubDiameter: positiveLength.default(28),
  hubHeight: positiveLength.default(25),
  boreDiameter: positiveLength.default(12),
  spokes: z.number().int().min(3).max(12).default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.rimWidth < p.outerDiameter / 5))
    context.addIssue({
      code: "custom",
      message: "Invalid handwheel dimensions: rimWidth < outerDiameter/5",
    })
  if (!(p.hubDiameter < p.outerDiameter - 4 * p.rimWidth))
    context.addIssue({
      code: "custom",
      message:
        "Invalid handwheel dimensions: hubDiameter < outerDiameter-4*rimWidth",
    })
  if (!(p.boreDiameter < p.hubDiameter * 0.8))
    context.addIssue({
      code: "custom",
      message: "Invalid handwheel dimensions: boreDiameter < hubDiameter*.8",
    })
  if (!(p.hubHeight >= p.rimWidth))
    context.addIssue({
      code: "custom",
      message: "Invalid handwheel dimensions: hubHeight >= rimWidth",
    })
}
export const handwheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const handwheelModelDefinitionSchema = z
  .object({ fn: z.literal("handwheel"), ...shape })
  .strict()
  .superRefine(validate)
export type HandwheelModelPropsInput = z.input<typeof handwheelModelPropsSchema>
export type HandwheelModelProps = z.output<typeof handwheelModelPropsSchema>
export type HandwheelModelDefinition = z.output<
  typeof handwheelModelDefinitionSchema
>
/** Flat-rim spoked handwheel with axial bore, rotating axis Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getHandwheelDimensions(input: HandwheelModelPropsInput = {}) {
  return handwheelModelPropsSchema.parse(input)
}
