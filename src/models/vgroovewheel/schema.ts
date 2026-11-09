import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(40),
  rootDiameter: positiveLength.default(28),
  boreDiameter: positiveLength.default(8),
  width: positiveLength.default(12),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.rootDiameter <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Groove root must leave material around the bore",
    })
  if (p.outerDiameter <= p.rootDiameter)
    context.addIssue({
      code: "custom",
      message: "Outside diameter must exceed the groove root diameter",
    })
}
export const vGrooveWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const vGrooveWheelModelDefinitionSchema = z
  .object({ fn: z.literal("vgroovewheel"), ...shape })
  .strict()
  .superRefine(validate)
export type VGrooveWheelModelPropsInput = z.input<
  typeof vGrooveWheelModelPropsSchema
>
export type VGrooveWheelModelProps = z.output<
  typeof vGrooveWheelModelPropsSchema
>
export type VGrooveWheelModelDefinition = z.output<
  typeof vGrooveWheelModelDefinitionSchema
>
/** Symmetric V-groove track wheel with straight axial bore. Z axis, bottom Z=0. Groove flanks run from 20%/80% of the width to the central root; this nominal track envelope does not specify a bearing or rail standard. All lengths are normalized to millimeters. */
export function getVGrooveWheelDimensions(
  input: VGrooveWheelModelPropsInput = {},
) {
  const p = vGrooveWheelModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.width] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.width,
  }
}
