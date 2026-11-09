import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  boreDiameter: positiveLength.default(20),
  flangeWidth: positiveLength.default(64),
  flangeThickness: positiveLength.default(6),
  housingDiameter: positiveLength.default(44),
  housingHeight: positiveLength.default(20),
  mountSpacing: positiveLength.default(46),
  mountHoleDiameter: positiveLength.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.housingDiameter <= p.boreDiameter + 12)
    context.addIssue({
      code: "custom",
      message: "Housing must leave space around the shaft for races and balls",
    })
  if (p.mountSpacing + p.mountHoleDiameter >= p.flangeWidth)
    context.addIssue({
      code: "custom",
      message: "Mounting holes must remain within the flange",
    })
  if (Math.SQRT2 * p.mountSpacing - p.mountHoleDiameter <= p.housingDiameter)
    context.addIssue({
      code: "custom",
      message: "Corner mounting holes must clear the raised bearing housing",
    })
  if (p.housingHeight <= 4)
    context.addIssue({
      code: "custom",
      message: "Housing height must leave room for rolling elements",
    })
  if (
    (((p.housingDiameter - p.boreDiameter) * 0.72 - 6) * 0.85) / 2 >=
    p.flangeThickness + p.housingHeight
  )
    context.addIssue({
      code: "custom",
      message: "Ball diameter must fit within bearing height",
    })
  if (
    (((p.housingDiameter - p.boreDiameter) * 0.72 - 6) * 0.85) / 2 >=
    ((2 * p.boreDiameter + (p.housingDiameter - p.boreDiameter) * 0.72) / 2) *
      Math.sin(Math.PI / 10)
  )
    context.addIssue({
      code: "custom",
      message:
        "Adjacent bearing balls must have positive circumferential clearance",
    })
}
export const flangeBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const flangeBearingModelDefinitionSchema = z
  .object({ fn: z.literal("flangebearing"), ...shape })
  .strict()
  .superRefine(validate)
export type FlangeBearingModelPropsInput = z.input<
  typeof flangeBearingModelPropsSchema
>
export type FlangeBearingModelProps = z.output<
  typeof flangeBearingModelPropsSchema
>
export type FlangeBearingModelDefinition = z.output<
  typeof flangeBearingModelDefinitionSchema
>
/** Square four-bolt flange bearing with an axial Z shaft bore and open top rolling-element race. Flange bottom is Z=0. Nominal assembly envelope and race clearances; not a manufacturer part or load-rated design. All lengths are normalized to millimeters. */
export function getFlangeBearingDimensions(
  input: FlangeBearingModelPropsInput = {},
) {
  const p = flangeBearingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.flangeWidth,
      p.flangeWidth,
      p.flangeThickness + p.housingHeight,
    ] as [number, number, number],
    bottomZ: 0,
    topZ: p.flangeThickness + p.housingHeight,
  }
}
