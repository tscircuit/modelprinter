import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  length: positiveLength.default(110),
  width: positiveLength.default(35),
  baseThickness: positiveLength.default(5),
  handleHeight: positiveLength.default(55),
  armLength: positiveLength.default(75),
  padDiameter: positiveLength.default(14),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.length > 2 * p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: length > 2*width",
    })
  if (!(p.handleHeight > p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: handleHeight > width",
    })
  if (!(p.armLength > p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: armLength > width",
    })
  if (!(p.armLength < 2 * p.length))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: armLength < 2*length",
    })
  if (!(p.padDiameter < p.width / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: padDiameter < width/2",
    })
  if (!(p.holeDiameter < p.width / 4))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: holeDiameter < width/4",
    })
  if (!(p.baseThickness < p.width / 4))
    context.addIssue({
      code: "custom",
      message: "Invalid toggleclamp dimensions: baseThickness < width/4",
    })
}
export const toggleClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const toggleClampModelDefinitionSchema = z
  .object({ fn: z.literal("toggleclamp"), ...shape })
  .strict()
  .superRefine(validate)
export type ToggleClampModelPropsInput = z.input<
  typeof toggleClampModelPropsSchema
>
export type ToggleClampModelProps = z.output<typeof toggleClampModelPropsSchema>
export type ToggleClampModelDefinition = z.output<
  typeof toggleClampModelDefinitionSchema
>
/** Nominal closed hold-down toggle clamp, long axis X, handle upright, bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getToggleClampDimensions(
  input: ToggleClampModelPropsInput = {},
) {
  return toggleClampModelPropsSchema.parse(input)
}
