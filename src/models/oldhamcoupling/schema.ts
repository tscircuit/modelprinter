import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (v) => v > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  length: positiveLength.default(36),
  boreDiameter: positiveLength.default(8),
  hubLength: positiveLength.default(12),
  slotWidth: positiveLength.default(7),
  slotDepth: positiveLength.default(3),
  clearance: industrialLengthSchema
    .refine((v) => v >= 0, "Clearance cannot be negative")
    .default(0.2),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.boreDiameter >= p.outerDiameter * 0.6)
    context.addIssue({
      code: "custom",
      message: "Bore must leave material in the center disk",
    })
  if (p.length - 2 * p.hubLength <= 2 * p.clearance)
    context.addIssue({
      code: "custom",
      message: "Hubs must leave room for a positive thickness center disk",
    })
  if (p.slotWidth >= p.outerDiameter * 0.7 || p.slotWidth <= 2 * p.clearance)
    context.addIssue({
      code: "custom",
      message: "Slot width must leave hub walls and positive tongue width",
    })
  if (p.slotDepth >= p.hubLength || p.slotDepth <= 2 * p.clearance)
    context.addIssue({
      code: "custom",
      message:
        "Slot depth must leave a hub floor and positive tongue engagement",
    })
  const bounds = [
    p.outerDiameter,
    p.length,
    p.boreDiameter,
    p.hubLength,
    p.slotWidth,
    p.slotDepth,
  ]
  if (!Number.isFinite(bounds.reduce((sum, value) => sum + value, 0)))
    context.addIssue({
      code: "custom",
      message: "Combined dimensions must remain finite",
    })
}
export const oldhamCouplingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const oldhamCouplingModelDefinitionSchema = z
  .object({ fn: z.literal("oldhamcoupling"), ...shape })
  .strict()
  .superRefine(validate)
export type OldhamCouplingModelPropsInput = z.input<
  typeof oldhamCouplingModelPropsSchema
>
export type OldhamCouplingModelProps = z.output<
  typeof oldhamCouplingModelPropsSchema
>
export type OldhamCouplingModelDefinition = z.output<
  typeof oldhamCouplingModelDefinitionSchema
>
/** Two coaxial slotted hubs and a separate center disk with orthogonal tongues. The two face slots and disk tongues engage along X and Y respectively; bottom datum is Z=0. All lengths normalize to millimeters. */
export function getOldhamCouplingDimensions(
  input: OldhamCouplingModelPropsInput = {},
) {
  const p = oldhamCouplingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    diskThickness: p.length - 2 * p.hubLength - 2 * p.clearance,
    diskDiameter: p.outerDiameter * 0.88,
    tongueWidth: p.slotWidth - 2 * p.clearance,
    tongueHeight: p.slotDepth - p.clearance,
  }
}
