import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  width: positiveLength.default(40),
  height: positiveLength.default(40),
  webThickness: positiveLength.default(4),
  flangeThickness: positiveLength.default(6),
  length: positiveLength.default(100),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.webThickness < p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid teebar dimensions: webThickness < width",
    })
  if (!(p.flangeThickness < p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid teebar dimensions: flangeThickness < height",
    })
}
export const teeBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const teeBarModelDefinitionSchema = z
  .object({ fn: z.literal("teebar"), ...shape })
  .strict()
  .superRefine(validate)
export type TeeBarModelPropsInput = z.input<typeof teeBarModelPropsSchema>
export type TeeBarModelProps = z.output<typeof teeBarModelPropsSchema>
export type TeeBarModelDefinition = z.output<typeof teeBarModelDefinitionSchema>
/** T-section stock, centered XY envelope, flange at maximum Y, length +Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getTeeBarDimensions(input: TeeBarModelPropsInput = {}) {
  return teeBarModelPropsSchema.parse(input)
}
