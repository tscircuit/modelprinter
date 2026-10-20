import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  pitch: positiveLength.default(8),
  toothCount: z.number().int().min(2).max(64).default(12),
  width: positiveLength.default(12),
  baseHeight: positiveLength.default(8),
  toothHeight: positiveLength.default(4),
  mountHoleDiameter: positiveLength.default(3.5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.mountHoleDiameter >= Math.min(p.width, p.pitch))
    context.addIssue({
      code: "custom",
      message: "Mounting holes must fit within rack width and end tooth pitch",
    })
  if (p.toothHeight >= p.pitch)
    context.addIssue({
      code: "custom",
      message: "Tooth height must be smaller than pitch",
    })
  if (p.toothCount < 3)
    context.addIssue({
      code: "custom",
      message: "Rack must have at least three teeth",
    })
}
export const gearRackModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const gearRackModelDefinitionSchema = z
  .object({ fn: z.literal("gearrack"), ...shape })
  .strict()
  .superRefine(validate)
export type GearRackModelPropsInput = z.input<typeof gearRackModelPropsSchema>
export type GearRackModelProps = z.output<typeof gearRackModelPropsSchema>
export type GearRackModelDefinition = z.output<
  typeof gearRackModelDefinitionSchema
>
/** Straight rack envelope along X with trapezoidal teeth above a mounting bar and two vertical mounting holes. Base underside Z=0. Teeth are nominal placement geometry, not conjugate involute teeth or a machining standard. All lengths are normalized to millimeters. */
export function getGearRackDimensions(input: GearRackModelPropsInput = {}) {
  const p = gearRackModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.pitch * p.toothCount, p.width, p.baseHeight + p.toothHeight] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.baseHeight + p.toothHeight,
  }
}
