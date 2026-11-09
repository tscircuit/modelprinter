import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  innerDiameter: positiveLength.default(20),
  outerDiameter: positiveLength.default(42),
  width: positiveLength.default(16),
  raceThickness: positiveLength.default(3),
  rollerCount: z.number().int().min(2).max(64).default(12),
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
      message: "Adjacent rollers must have positive circumferential clearance",
    })
}
export const cylindricalRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cylindricalRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("cylindricalrollerbearing"), ...shape })
  .strict()
  .superRefine(validate)
export type CylindricalRollerBearingModelPropsInput = z.input<
  typeof cylindricalRollerBearingModelPropsSchema
>
export type CylindricalRollerBearingModelProps = z.output<
  typeof cylindricalRollerBearingModelPropsSchema
>
export type CylindricalRollerBearingModelDefinition = z.output<
  typeof cylindricalRollerBearingModelDefinitionSchema
>
/** Open cylindrical-roller radial bearing with short axial rollers between inner and outer races and an outer retaining lip. Axis Z, bottom Z=0. Assembly envelope only; cage/preload and load rating are not specified. All lengths are normalized to millimeters. */
export function getCylindricalRollerBearingDimensions(
  input: CylindricalRollerBearingModelPropsInput = {},
) {
  const p = cylindricalRollerBearingModelPropsSchema.parse(input)
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
