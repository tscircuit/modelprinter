import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  height: positiveLength.default(60),
  barrelDiameter: positiveLength.default(14),
  pinDiameter: positiveLength.default(6),
  leafWidth: positiveLength.default(20),
  leafThickness: positiveLength.default(4),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.height > 3 * p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid barrelhinge dimensions: height > 3*barrelDiameter",
    })
  if (!(p.pinDiameter < p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid barrelhinge dimensions: pinDiameter < barrelDiameter",
    })
  if (!(p.leafThickness < p.barrelDiameter / 2))
    context.addIssue({
      code: "custom",
      message:
        "Invalid barrelhinge dimensions: leafThickness < barrelDiameter/2",
    })
  if (!(p.leafWidth > p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid barrelhinge dimensions: leafWidth > barrelDiameter",
    })
  if (!(p.holeDiameter < Math.min(p.leafWidth, p.height / 4) / 2))
    context.addIssue({
      code: "custom",
      message:
        "Invalid barrelhinge dimensions: holeDiameter < Math.min(leafWidth,height/4)/2",
    })
}
export const barrelHingeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const barrelHingeModelDefinitionSchema = z
  .object({ fn: z.literal("barrelhinge"), ...shape })
  .strict()
  .superRefine(validate)
export type BarrelHingeModelPropsInput = z.input<
  typeof barrelHingeModelPropsSchema
>
export type BarrelHingeModelProps = z.output<typeof barrelHingeModelPropsSchema>
export type BarrelHingeModelDefinition = z.output<
  typeof barrelHingeModelDefinitionSchema
>
/** Vertical barrel hinge, axis Z, opposed mounting tabs, bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getBarrelHingeDimensions(
  input: BarrelHingeModelPropsInput = {},
) {
  return barrelHingeModelPropsSchema.parse(input)
}
