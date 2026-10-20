import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  length: positiveLength.default(90),
  width: positiveLength.default(18),
  height: positiveLength.default(16),
  hubDiameter: positiveLength.default(28),
  hubHeight: positiveLength.default(25),
  boreDiameter: positiveLength.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.length > 2 * p.hubDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid leverhandle dimensions: length > 2*hubDiameter",
    })
  if (!(p.width < p.hubDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid leverhandle dimensions: width < hubDiameter",
    })
  if (!(p.height <= p.hubHeight))
    context.addIssue({
      code: "custom",
      message: "Invalid leverhandle dimensions: height <= hubHeight",
    })
  if (!(p.boreDiameter < p.hubDiameter * 0.7))
    context.addIssue({
      code: "custom",
      message: "Invalid leverhandle dimensions: boreDiameter < hubDiameter*.7",
    })
}
export const leverHandleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const leverHandleModelDefinitionSchema = z
  .object({ fn: z.literal("leverhandle"), ...shape })
  .strict()
  .superRefine(validate)
export type LeverHandleModelPropsInput = z.input<
  typeof leverHandleModelPropsSchema
>
export type LeverHandleModelProps = z.output<typeof leverHandleModelPropsSchema>
export type LeverHandleModelDefinition = z.output<
  typeof leverHandleModelDefinitionSchema
>
/** Lever handle extending along +X from bored hub; bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getLeverHandleDimensions(
  input: LeverHandleModelPropsInput = {},
) {
  return leverHandleModelPropsSchema.parse(input)
}
