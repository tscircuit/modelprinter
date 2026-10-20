import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  size: positiveLength.default(80),
  thickness: positiveLength.default(25),
  hubDiameter: positiveLength.default(28),
  bladeCount: z.number().int().min(3).max(12).default(7),
  bladeWidth: positiveLength.default(12),
  bladeThickness: positiveLength.default(3),
  mountingHoleDiameter: positiveLength.default(4),
  frameThickness: positiveLength.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.frameThickness < p.size / 8))
    context.addIssue({
      code: "custom",
      message: "Invalid coolingfan dimensions: frameThickness < size/8",
    })
  if (!(p.mountingHoleDiameter < p.frameThickness * 0.8))
    context.addIssue({
      code: "custom",
      message:
        "Invalid coolingfan dimensions: mountingHoleDiameter < frameThickness*.8",
    })
  if (!(p.hubDiameter < p.size - 4 * p.frameThickness))
    context.addIssue({
      code: "custom",
      message:
        "Invalid coolingfan dimensions: hubDiameter < size-4*frameThickness",
    })
  if (!(p.bladeWidth < p.size / 4))
    context.addIssue({
      code: "custom",
      message: "Invalid coolingfan dimensions: bladeWidth < size/4",
    })
  if (!(p.bladeThickness < p.thickness / 3))
    context.addIssue({
      code: "custom",
      message: "Invalid coolingfan dimensions: bladeThickness < thickness/3",
    })
  if (!(p.thickness < p.size))
    context.addIssue({
      code: "custom",
      message: "Invalid coolingfan dimensions: thickness < size",
    })
}
export const coolingFanModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const coolingFanModelDefinitionSchema = z
  .object({ fn: z.literal("coolingfan"), ...shape })
  .strict()
  .superRefine(validate)
export type CoolingFanModelPropsInput = z.input<
  typeof coolingFanModelPropsSchema
>
export type CoolingFanModelProps = z.output<typeof coolingFanModelPropsSchema>
export type CoolingFanModelDefinition = z.output<
  typeof coolingFanModelDefinitionSchema
>
/** Nominal axial cooling fan with square shroud, four mount holes, curved-plan blades and support spokes; airflow axis Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getCoolingFanDimensions(input: CoolingFanModelPropsInput = {}) {
  return coolingFanModelPropsSchema.parse(input)
}
