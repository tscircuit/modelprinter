import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  diameter: positiveLength.default(20),
  length: positiveLength.default(100),
  chamfer: positiveLength.default(1),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.chamfer < p.diameter / 3))
    context.addIssue({
      code: "custom",
      message: "Invalid roundbar dimensions: chamfer < diameter/3",
    })
  if (!(2 * p.chamfer < p.length))
    context.addIssue({
      code: "custom",
      message: "Invalid roundbar dimensions: 2*chamfer < length",
    })
}
export const roundBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const roundBarModelDefinitionSchema = z
  .object({ fn: z.literal("roundbar"), ...shape })
  .strict()
  .superRefine(validate)
export type RoundBarModelPropsInput = z.input<typeof roundBarModelPropsSchema>
export type RoundBarModelProps = z.output<typeof roundBarModelPropsSchema>
export type RoundBarModelDefinition = z.output<
  typeof roundBarModelDefinitionSchema
>
/** Round stock along +Z with equal end chamfers; bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getRoundBarDimensions(input: RoundBarModelPropsInput = {}) {
  return roundBarModelPropsSchema.parse(input)
}
