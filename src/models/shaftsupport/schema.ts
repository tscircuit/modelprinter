import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  boreDiameter: positiveLength.default(16),
  baseWidth: positiveLength.default(55),
  baseDepth: positiveLength.default(32),
  baseThickness: positiveLength.default(7),
  headWidth: positiveLength.default(26),
  headDepth: positiveLength.default(20),
  headHeight: positiveLength.default(34),
  centerHeight: positiveLength.default(26),
  mountSpacing: positiveLength.default(40),
  mountHoleDiameter: positiveLength.default(5),
  slitWidth: positiveLength.default(1.5),
  clampHoleDiameter: positiveLength.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.headWidth <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Support head must leave material around the shaft bore",
    })
  if (p.centerHeight - p.boreDiameter / 2 <= p.baseThickness)
    context.addIssue({
      code: "custom",
      message: "Shaft bore must clear the mounting foot",
    })
  if (
    p.centerHeight + p.boreDiameter / 2 + p.clampHoleDiameter >=
    p.baseThickness + p.headHeight
  )
    context.addIssue({
      code: "custom",
      message: "Head must leave upper material for the clamping screw bore",
    })
  if (p.mountSpacing + p.mountHoleDiameter >= p.baseWidth)
    context.addIssue({
      code: "custom",
      message: "Mounting holes must remain within the mounting foot",
    })
  if (p.mountSpacing - p.mountHoleDiameter <= p.headWidth)
    context.addIssue({
      code: "custom",
      message: "Mounting holes must clear the support head",
    })
  if (p.slitWidth >= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Split slit must be narrower than the shaft bore",
    })
  if (p.headDepth >= p.baseDepth)
    context.addIssue({
      code: "custom",
      message: "Head depth must be less than mounting-foot depth",
    })
  if (p.mountHoleDiameter >= p.baseDepth)
    context.addIssue({
      code: "custom",
      message: "Mounting-hole diameter must be less than mounting-foot depth",
    })
  if (p.clampHoleDiameter >= p.headDepth)
    context.addIssue({
      code: "custom",
      message: "Clamping-screw diameter must be less than head depth",
    })
}
export const shaftSupportModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const shaftSupportModelDefinitionSchema = z
  .object({ fn: z.literal("shaftsupport"), ...shape })
  .strict()
  .superRefine(validate)
export type ShaftSupportModelPropsInput = z.input<
  typeof shaftSupportModelPropsSchema
>
export type ShaftSupportModelProps = z.output<
  typeof shaftSupportModelPropsSchema
>
export type ShaftSupportModelDefinition = z.output<
  typeof shaftSupportModelDefinitionSchema
>
/** Split shaft support with a horizontal Y shaft bore, top clamping slit, transverse X clamp-screw bore and two vertical foot mounting bores. Bottom Z=0. No thread, clamp hardware or load rating is specified. All lengths are normalized to millimeters. */
export function getShaftSupportDimensions(
  input: ShaftSupportModelPropsInput = {},
) {
  const p = shaftSupportModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.baseWidth, p.baseDepth, p.baseThickness + p.headHeight] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.baseThickness + p.headHeight,
  }
}
