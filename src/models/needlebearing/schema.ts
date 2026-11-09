import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  innerDiameter: positiveLength.default(20),
  outerDiameter: positiveLength.default(30),
  width: positiveLength.default(20),
  raceThickness: positiveLength.default(1.5),
  rollerCount: z.number().int().min(2).max(64).default(18),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.outerDiameter - p.innerDiameter <= 4 * p.raceThickness)
    context.addIssue({
      code: "custom",
      message: "The races must leave a positive radial roller gap",
    })
  if (p.width <= p.raceThickness * 2)
    context.addIssue({
      code: "custom",
      message: "Width must exceed twice the race thickness",
    })
  if (
    ((p.outerDiameter - p.innerDiameter) / 2 - 2 * p.raceThickness) * 0.85 >=
    ((p.outerDiameter + p.innerDiameter) / 2) *
      Math.sin(Math.PI / p.rollerCount)
  )
    context.addIssue({
      code: "custom",
      message: "Adjacent needles must have positive circumferential clearance",
    })
}
export const needleBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const needleBearingModelDefinitionSchema = z
  .object({ fn: z.literal("needlebearing"), ...shape })
  .strict()
  .superRefine(validate)
export type NeedleBearingModelPropsInput = z.input<
  typeof needleBearingModelPropsSchema
>
export type NeedleBearingModelProps = z.output<
  typeof needleBearingModelPropsSchema
>
export type NeedleBearingModelDefinition = z.output<
  typeof needleBearingModelDefinitionSchema
>
/** Open straight-needle radial bearing. Axis is Z and lower face is Z=0. Inner and outer races enclose separately visible axial needles. Roller sizes/clearances are nominal and do not define a bearing standard or rating. All lengths are normalized to millimeters. */
export function getNeedleBearingDimensions(
  input: NeedleBearingModelPropsInput = {},
) {
  const p = needleBearingModelPropsSchema.parse(input)
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
