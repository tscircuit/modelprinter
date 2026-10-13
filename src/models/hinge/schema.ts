import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  width: positiveLength.default(60),
  length: positiveLength.default(60),
  leafThickness: positiveLength.default(3),
  barrelDiameter: positiveLength.default(10),
  pinDiameter: positiveLength.default(4),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.width > 3 * p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid hinge dimensions: width > 3*barrelDiameter",
    })
  if (!(p.length > 3 * p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid hinge dimensions: length > 3*barrelDiameter",
    })
  if (!(p.pinDiameter < p.barrelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid hinge dimensions: pinDiameter < barrelDiameter",
    })
  if (!(p.leafThickness < p.barrelDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid hinge dimensions: leafThickness < barrelDiameter/2",
    })
  if (!(p.holeDiameter < Math.min(p.width, p.length) / 8))
    context.addIssue({
      code: "custom",
      message:
        "Invalid hinge dimensions: holeDiameter < Math.min(width,length)/8",
    })
}
export const hingeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hingeModelDefinitionSchema = z
  .object({ fn: z.literal("hinge"), ...shape })
  .strict()
  .superRefine(validate)
export type HingeModelPropsInput = z.input<typeof hingeModelPropsSchema>
export type HingeModelProps = z.output<typeof hingeModelPropsSchema>
export type HingeModelDefinition = z.output<typeof hingeModelDefinitionSchema>
/** Flat open butt hinge, leaves in XY, hinge axis along Y; bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getHingeDimensions(input: HingeModelPropsInput = {}) {
  return hingeModelPropsSchema.parse(input)
}
