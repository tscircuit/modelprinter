import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (v) => v > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(40),
  topDiameter: positiveLength.default(24),
  height: positiveLength.default(14),
  boreDiameter: positiveLength.default(8),
  toothDepth: positiveLength.default(3),
  hubDiameter: positiveLength.default(20),
  hubHeight: positiveLength.default(8),
  teeth: z.number().int().min(6).max(96).default(16),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.topDiameter >= p.outerDiameter)
    context.addIssue({
      code: "custom",
      message: "Top diameter must be smaller than the large gear face",
    })
  if (2 * p.toothDepth >= p.topDiameter - p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Tooth roots must leave positive material around the bore",
    })
  if (p.hubDiameter > p.topDiameter || p.hubDiameter <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Hub must fit on the small gear face and around the shaft bore",
    })
  const bounds = [
    p.outerDiameter,
    p.topDiameter,
    p.height,
    p.boreDiameter,
    p.toothDepth,
    p.hubDiameter,
    p.hubHeight,
  ]
  if (!Number.isFinite(bounds.reduce((sum, value) => sum + value, 0)))
    context.addIssue({
      code: "custom",
      message: "Combined dimensions must remain finite",
    })
}
export const bevelGearModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const bevelGearModelDefinitionSchema = z
  .object({ fn: z.literal("bevelgear"), ...shape })
  .strict()
  .superRefine(validate)
export type BevelGearModelPropsInput = z.input<typeof bevelGearModelPropsSchema>
export type BevelGearModelProps = z.output<typeof bevelGearModelPropsSchema>
export type BevelGearModelDefinition = z.output<
  typeof bevelGearModelDefinitionSchema
>
/** Straight bevel gear with a tapering tooth envelope and a bored hub on its small face. Teeth use a nominal trapezoidal section for assembly visualization, not a conjugate or manufacturable tooth profile. All lengths normalize to millimeters. */
export function getBevelGearDimensions(input: BevelGearModelPropsInput = {}) {
  const p = bevelGearModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.height + p.hubHeight] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.height + p.hubHeight,
    pitchAngle: 360 / p.teeth,
    rootDiameter: p.outerDiameter - 2 * p.toothDepth,
    topRootDiameter: p.topDiameter - 2 * p.toothDepth,
  }
}
