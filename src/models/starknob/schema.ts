import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  diameter: positiveLength.default(40),
  height: positiveLength.default(16),
  boreDiameter: positiveLength.default(6),
  lobes: z.number().int().min(3).max(10).default(5),
  hubDiameter: positiveLength.default(18),
  hubHeight: positiveLength.default(10),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.boreDiameter < p.hubDiameter * 0.8))
    context.addIssue({
      code: "custom",
      message: "Invalid starknob dimensions: boreDiameter < hubDiameter*.8",
    })
  if (!(p.hubDiameter < p.diameter * 0.6))
    context.addIssue({
      code: "custom",
      message: "Invalid starknob dimensions: hubDiameter < diameter*.6",
    })
  if (!(p.height < p.diameter))
    context.addIssue({
      code: "custom",
      message: "Invalid starknob dimensions: height < diameter",
    })
}
export const starKnobModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const starKnobModelDefinitionSchema = z
  .object({ fn: z.literal("starknob"), ...shape })
  .strict()
  .superRefine(validate)
export type StarKnobModelPropsInput = z.input<typeof starKnobModelPropsSchema>
export type StarKnobModelProps = z.output<typeof starKnobModelPropsSchema>
export type StarKnobModelDefinition = z.output<
  typeof starKnobModelDefinitionSchema
>
/** Lobed star knob with bottom hub and axial through bore, axis Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getStarKnobDimensions(input: StarKnobModelPropsInput = {}) {
  return starKnobModelPropsSchema.parse(input)
}
