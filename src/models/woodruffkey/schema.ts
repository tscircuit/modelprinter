import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  diameter: positiveLength.default(30),
  thickness: positiveLength.default(6),
  height: positiveLength.default(12),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.height <= p.diameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid woodruffkey dimensions: height <= diameter/2",
    })
  if (!(p.thickness < p.diameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid woodruffkey dimensions: thickness < diameter/2",
    })
}
export const woodruffKeyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const woodruffKeyModelDefinitionSchema = z
  .object({ fn: z.literal("woodruffkey"), ...shape })
  .strict()
  .superRefine(validate)
export type WoodruffKeyModelPropsInput = z.input<
  typeof woodruffKeyModelPropsSchema
>
export type WoodruffKeyModelProps = z.output<typeof woodruffKeyModelPropsSchema>
export type WoodruffKeyModelDefinition = z.output<
  typeof woodruffKeyModelDefinitionSchema
>
/** Circular segment key in XZ, thickness along Y, flat top at Z=height, bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getWoodruffKeyDimensions(
  input: WoodruffKeyModelPropsInput = {},
) {
  return woodruffKeyModelPropsSchema.parse(input)
}
