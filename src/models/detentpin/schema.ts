import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  shaftDiameter: positiveLength.default(8),
  shaftLength: positiveLength.default(50),
  headDiameter: positiveLength.default(18),
  headHeight: positiveLength.default(6),
  ballDiameter: positiveLength.default(3),
  ballOffset: positiveLength.default(4),
  ringDiameter: positiveLength.default(24),
  ringWire: positiveLength.default(2),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.headDiameter > p.shaftDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: headDiameter > shaftDiameter",
    })
  if (!(p.ballDiameter < p.shaftDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: ballDiameter < shaftDiameter/2",
    })
  if (!(p.ballOffset > p.ballDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: ballOffset > ballDiameter/2",
    })
  if (!(p.ballOffset < p.shaftLength / 3))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: ballOffset < shaftLength/3",
    })
  if (!(p.ringDiameter > 4 * p.ringWire))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: ringDiameter > 4*ringWire",
    })
  if (!(p.ringWire < p.headHeight / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid detentpin dimensions: ringWire < headHeight/2",
    })
}
export const detentPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const detentPinModelDefinitionSchema = z
  .object({ fn: z.literal("detentpin"), ...shape })
  .strict()
  .superRefine(validate)
export type DetentPinModelPropsInput = z.input<typeof detentPinModelPropsSchema>
export type DetentPinModelProps = z.output<typeof detentPinModelPropsSchema>
export type DetentPinModelDefinition = z.output<
  typeof detentPinModelDefinitionSchema
>
/** Nominal ball detent pin, shaft Z, transverse pull ring in XZ; mechanism internals omitted. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getDetentPinDimensions(input: DetentPinModelPropsInput = {}) {
  return detentPinModelPropsSchema.parse(input)
}
