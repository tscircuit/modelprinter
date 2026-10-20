import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(60),
  boreDiameter: positiveLength.default(12),
  width: positiveLength.default(24),
  grooveCount: z.number().int().min(2).max(64).default(2),
  grooveDepth: positiveLength.default(8),
  grooveWidth: positiveLength.default(9),
  hubDiameter: positiveLength.default(26),
  hubHeight: positiveLength.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.grooveCount * p.grooveWidth >= p.width)
    context.addIssue({
      code: "custom",
      message: "Grooves must leave positive-width outer lands",
    })
  if (p.outerDiameter / 2 - p.grooveDepth <= p.hubDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Groove roots must leave radial material outside the hub",
    })
  if (p.hubDiameter <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Hub must leave material around the shaft bore",
    })
}
export const vBeltSheaveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const vBeltSheaveModelDefinitionSchema = z
  .object({ fn: z.literal("vbeltsheave"), ...shape })
  .strict()
  .superRefine(validate)
export type VBeltSheaveModelPropsInput = z.input<
  typeof vBeltSheaveModelPropsSchema
>
export type VBeltSheaveModelProps = z.output<typeof vBeltSheaveModelPropsSchema>
export type VBeltSheaveModelDefinition = z.output<
  typeof vBeltSheaveModelDefinitionSchema
>
/** Multi-groove V-belt sheave with sloped circumferential groove flanks, small root land, hub and through bore. Axis Z, bottom Z=0. Nominal groove envelope; belt section standard, taper bushing and keyway are not specified. All lengths are normalized to millimeters. */
export function getVBeltSheaveDimensions(
  input: VBeltSheaveModelPropsInput = {},
) {
  const p = vBeltSheaveModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.width + p.hubHeight] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.width + p.hubHeight,
  }
}
