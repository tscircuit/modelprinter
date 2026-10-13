import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  width: positive.default(40),
  height: positive.default(40),
  length: positive.default(100),
  thickness: positive.default(2),
  slotWidth: positive.default(4),
  slotPitch: positive.default(8),
  holeDiameter: positive.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (2 * p.thickness >= p.width || 4 * p.thickness >= p.height)
    context.addIssue({
      code: "custom",
      message: "Incompatible wireduct dimensions: 1",
    })
  if (p.slotWidth >= p.slotPitch)
    context.addIssue({
      code: "custom",
      message: "Incompatible wireduct dimensions: 2",
    })
  if (p.slotPitch >= p.length)
    context.addIssue({
      code: "custom",
      message: "Incompatible wireduct dimensions: 3",
    })
  if (p.holeDiameter >= p.width - 2 * p.thickness)
    context.addIssue({
      code: "custom",
      message: "Incompatible wireduct dimensions: 4",
    })
  if (p.length / p.slotPitch > 512 || p.length > 12800)
    context.addIssue({
      code: "custom",
      message: "Too many repeated rail or duct features; maximum 512",
    })
}
export const wireDuctModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const wireDuctModelDefinitionSchema = z
  .object({ fn: z.literal("wireduct"), ...shape })
  .strict()
  .superRefine(validate)
export type WireDuctModelPropsInput = z.input<typeof wireDuctModelPropsSchema>
export type WireDuctModelProps = z.output<typeof wireDuctModelPropsSchema>
export type WireDuctModelDefinition = z.output<
  typeof wireDuctModelDefinitionSchema
>
/** Open slotted wire duct with a continuous floor, two comb sidewalls and repeated bottom mounting holes. Length runs along X. The removable lid and flexible sidewall deformation are omitted. All normalized lengths are millimeters. */
export function getWireDuctDimensions(input: WireDuctModelPropsInput = {}) {
  const p = wireDuctModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.height] as [number, number, number],
  }
}
