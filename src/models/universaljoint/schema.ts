import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (v) => v > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  length: positiveLength.default(60),
  boreDiameter: positiveLength.default(8),
  hubLength: positiveLength.default(14),
  armThickness: positiveLength.default(5),
  crossDiameter: positiveLength.default(6),
  clearance: industrialLengthSchema
    .refine((v) => v >= 0, "Clearance cannot be negative")
    .default(0.2),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.armThickness * 3 >= p.outerDiameter)
    context.addIssue({
      code: "custom",
      message: "Fork arms must leave room between opposing ears",
    })
  if (p.boreDiameter >= p.outerDiameter - 2 * p.armThickness)
    context.addIssue({
      code: "custom",
      message: "Shaft bore must leave solid material behind each fork",
    })
  if (p.hubLength >= p.length / 2 - p.crossDiameter)
    context.addIssue({
      code: "custom",
      message: "Hub lengths must leave fork arms around the center cross",
    })
  if (p.crossDiameter * 1.8 >= p.outerDiameter - 2 * p.armThickness)
    context.addIssue({
      code: "custom",
      message: "The perpendicular forks must clear one another",
    })
  if (p.crossDiameter / 2 + p.clearance >= (p.crossDiameter * 1.8) / 2)
    context.addIssue({
      code: "custom",
      message: "Cross clearance must leave material around its journal holes",
    })
  const bounds = [
    p.outerDiameter,
    p.length,
    p.boreDiameter,
    p.hubLength,
    p.armThickness,
    p.crossDiameter,
  ]
  if (!Number.isFinite(bounds.reduce((sum, value) => sum + value, 0)))
    context.addIssue({
      code: "custom",
      message: "Combined dimensions must remain finite",
    })
}
export const universalJointModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const universalJointModelDefinitionSchema = z
  .object({ fn: z.literal("universaljoint"), ...shape })
  .strict()
  .superRefine(validate)
export type UniversalJointModelPropsInput = z.input<
  typeof universalJointModelPropsSchema
>
export type UniversalJointModelProps = z.output<
  typeof universalJointModelPropsSchema
>
export type UniversalJointModelDefinition = z.output<
  typeof universalJointModelDefinitionSchema
>
/** Straight pose of a universal joint with two orthogonal forks, transverse journal holes, and a solid four-arm center cross. Both shaft axes are Z; the center cross lies at Z=length/2. All lengths normalize to millimeters. */
export function getUniversalJointDimensions(
  input: UniversalJointModelPropsInput = {},
) {
  const p = universalJointModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    crossZ: p.length / 2,
    crossSpan: p.outerDiameter - p.armThickness,
    earWidth: p.crossDiameter * 1.8,
  }
}
