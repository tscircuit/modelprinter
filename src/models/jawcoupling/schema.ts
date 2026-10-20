import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (v) => v > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  length: positiveLength.default(40),
  boreDiameter: positiveLength.default(8),
  hubLength: positiveLength.default(12),
  jawDepth: positiveLength.default(12),
  jawCount: z.number().int().min(3).max(12).default(3),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.boreDiameter >= p.outerDiameter * 0.7)
    context.addIssue({
      code: "custom",
      message: "Bore must leave material in the hubs and jaws",
    })
  if (2 * p.hubLength >= p.length)
    context.addIssue({
      code: "custom",
      message: "Hubs must leave a central jaw region",
    })
  if (
    p.jawDepth <= (p.length - 2 * p.hubLength) / 2 ||
    p.jawDepth > p.length - 2 * p.hubLength
  )
    context.addIssue({
      code: "custom",
      message:
        "Opposing jaws must engage in the central region without reaching the opposite hub",
    })
  const bounds = [
    p.outerDiameter,
    p.length,
    p.boreDiameter,
    p.hubLength,
    p.jawDepth,
  ]
  if (!Number.isFinite(bounds.reduce((sum, value) => sum + value, 0)))
    context.addIssue({
      code: "custom",
      message: "Combined dimensions must remain finite",
    })
}
export const jawCouplingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const jawCouplingModelDefinitionSchema = z
  .object({ fn: z.literal("jawcoupling"), ...shape })
  .strict()
  .superRefine(validate)
export type JawCouplingModelPropsInput = z.input<
  typeof jawCouplingModelPropsSchema
>
export type JawCouplingModelProps = z.output<typeof jawCouplingModelPropsSchema>
export type JawCouplingModelDefinition = z.output<
  typeof jawCouplingModelDefinitionSchema
>
/** Two coaxial hubs with interleaved drive jaws and a separate six-or-more-arm spider. Shafts run along +Z; bottom hub starts at Z=0. All lengths normalize to millimeters. */
export function getJawCouplingDimensions(
  input: JawCouplingModelPropsInput = {},
) {
  const p = jawCouplingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    centralLength: p.length - 2 * p.hubLength,
    jawInnerRadius: (p.boreDiameter + p.outerDiameter) / 4,
  }
}
