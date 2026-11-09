import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  baseDiameter: positiveLength.default(50),
  baseHeight: positiveLength.default(12),
  stemDiameter: positiveLength.default(12),
  stemLength: positiveLength.default(55),
  hexDiameter: positiveLength.default(24),
  hexHeight: positiveLength.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.stemDiameter < p.hexDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid levelingfoot dimensions: stemDiameter < hexDiameter",
    })
  if (!(p.hexDiameter < p.baseDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid levelingfoot dimensions: hexDiameter < baseDiameter",
    })
  if (!(p.baseHeight < p.baseDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid levelingfoot dimensions: baseHeight < baseDiameter/2",
    })
  if (!(p.hexHeight < p.stemLength / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid levelingfoot dimensions: hexHeight < stemLength/2",
    })
}
export const levelingFootModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const levelingFootModelDefinitionSchema = z
  .object({ fn: z.literal("levelingfoot"), ...shape })
  .strict()
  .superRefine(validate)
export type LevelingFootModelPropsInput = z.input<
  typeof levelingFootModelPropsSchema
>
export type LevelingFootModelProps = z.output<
  typeof levelingFootModelPropsSchema
>
export type LevelingFootModelDefinition = z.output<
  typeof levelingFootModelDefinitionSchema
>
/** Leveling foot with puck, nominal smooth threaded-stem envelope and hex lock nut, axis Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getLevelingFootDimensions(
  input: LevelingFootModelPropsInput = {},
) {
  return levelingFootModelPropsSchema.parse(input)
}
