import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(60),
  rootDiameter: positiveLength.default(48),
  width: positiveLength.default(8),
  boreDiameter: positiveLength.default(12),
  toothCount: z.number().int().min(2).max(64).default(16),
  hubDiameter: positiveLength.default(26),
  hubHeight: positiveLength.default(10),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.outerDiameter <= p.rootDiameter)
    context.addIssue({
      code: "custom",
      message: "Outside diameter must exceed the tooth-root diameter",
    })
  if (p.rootDiameter <= p.hubDiameter)
    context.addIssue({
      code: "custom",
      message: "Tooth-root diameter must exceed the hub diameter",
    })
  if (p.hubDiameter <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Hub must leave material around the shaft bore",
    })
  if (p.outerDiameter - p.rootDiameter >= p.rootDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Tooth height must be less than half the root radius",
    })
  const pocketRadius = (p.outerDiameter - p.rootDiameter) * 0.3
  if (
    pocketRadius >=
    (p.rootDiameter / 2 + pocketRadius) * Math.sin(Math.PI / p.toothCount)
  )
    context.addIssue({
      code: "custom",
      message: "Adjacent roller pockets must leave a positive tooth bridge",
    })
}
export const sprocketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const sprocketModelDefinitionSchema = z
  .object({ fn: z.literal("sprocket"), ...shape })
  .strict()
  .superRefine(validate)
export type SprocketModelPropsInput = z.input<typeof sprocketModelPropsSchema>
export type SprocketModelProps = z.output<typeof sprocketModelPropsSchema>
export type SprocketModelDefinition = z.output<
  typeof sprocketModelDefinitionSchema
>
/** Chain-sprocket envelope with circular roller pockets between radial teeth, hub shoulder and through bore. Axis Z, bottom Z=0. Tooth/pocket outline is nominal, not a chain pitch standard, conjugate roller seating profile or cutting specification. All lengths are normalized to millimeters. */
export function getSprocketDimensions(input: SprocketModelPropsInput = {}) {
  const p = sprocketModelPropsSchema.parse(input)
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
