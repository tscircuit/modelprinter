import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  wheelDiameter: positiveLength.default(75),
  wheelWidth: positiveLength.default(24),
  axleDiameter: positiveLength.default(10),
  forkThickness: positiveLength.default(5),
  plateWidth: positiveLength.default(50),
  plateLength: positiveLength.default(65),
  plateThickness: positiveLength.default(5),
  overallHeight: positiveLength.default(110),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.axleDiameter < p.wheelDiameter / 3))
    context.addIssue({
      code: "custom",
      message: "Invalid caster dimensions: axleDiameter < wheelDiameter/3",
    })
  if (!(p.wheelWidth < p.wheelDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid caster dimensions: wheelWidth < wheelDiameter",
    })
  if (!(p.forkThickness < p.wheelWidth / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid caster dimensions: forkThickness < wheelWidth/2",
    })
  if (!(p.plateWidth > p.wheelWidth + 2 * p.forkThickness + 2))
    context.addIssue({
      code: "custom",
      message:
        "Invalid caster dimensions: plateWidth > wheelWidth+2*forkThickness+2",
    })
  if (!(p.plateLength > p.wheelDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid caster dimensions: plateLength > wheelDiameter/2",
    })
  if (!(p.overallHeight > p.wheelDiameter + p.plateThickness))
    context.addIssue({
      code: "custom",
      message:
        "Invalid caster dimensions: overallHeight > wheelDiameter+plateThickness",
    })
  if (!(p.holeDiameter < Math.min(p.plateWidth, p.plateLength) / 8))
    context.addIssue({
      code: "custom",
      message:
        "Invalid caster dimensions: holeDiameter < Math.min(plateWidth,plateLength)/8",
    })
}
export const casterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const casterModelDefinitionSchema = z
  .object({ fn: z.literal("caster"), ...shape })
  .strict()
  .superRefine(validate)
export type CasterModelPropsInput = z.input<typeof casterModelPropsSchema>
export type CasterModelProps = z.output<typeof casterModelPropsSchema>
export type CasterModelDefinition = z.output<typeof casterModelDefinitionSchema>
/** Nominal fixed caster assembly: rolling axis Y, plate in XY, wheel contact Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getCasterDimensions(input: CasterModelPropsInput = {}) {
  return casterModelPropsSchema.parse(input)
}
