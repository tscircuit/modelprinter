import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(22),
  boreDiameter: positiveLength.default(8),
  length: positiveLength.default(40),
  tubeDiameter: positiveLength.default(12),
  nutAcrossFlats: positiveLength.default(26),
  nutLength: positiveLength.default(10),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.tubeDiameter))
    issue("Requires boreDiameter < tubeDiameter")
  if (!(p.tubeDiameter < p.outerDiameter))
    issue("Requires tubeDiameter < outerDiameter")
  if (!(p.outerDiameter < p.nutAcrossFlats))
    issue("Requires outerDiameter < nutAcrossFlats")
  if (!(p.nutLength * 2 < p.length)) issue("Requires nutLength * 2 < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.tubeDiameter - p.boreDiameter,
    p.outerDiameter - p.tubeDiameter,
    p.nutAcrossFlats - p.outerDiameter,
    p.length - p.nutLength * 2,
  ]
  if (clearances.some((gap) => gap < minimumGap))
    issue(
      "Material and clearance dimensions exceed nominal geometry resolution",
    )
  if (Math.max(...dimensions) > 100000 || Math.min(...dimensions) < 0.001)
    issue(
      "Dimensions must remain within nominal geometry limits (0.001 to 100000 mm)",
    )
  if (Math.min(...dimensions) / Math.max(...dimensions) < 1e-5)
    issue("Dimensions exceed nominal geometry resolution")
}
/** Custom nominal millimeter dimensions; smooth thread envelopes do not certify a pipe standard. */
export const compressionFittingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const compressionFittingModelDefinitionSchema = z
  .object({ fn: z.literal("compressionfitting"), ...shape })
  .strict()
  .superRefine(validate)
export type CompressionFittingModelPropsInput = z.input<
  typeof compressionFittingModelPropsSchema
>
export type CompressionFittingModelProps = z.output<
  typeof compressionFittingModelPropsSchema
>
export type CompressionFittingModelDefinition = z.output<
  typeof compressionFittingModelDefinitionSchema
>
export function getCompressionFittingDimensions(
  input: CompressionFittingModelPropsInput = {},
) {
  return compressionFittingModelPropsSchema.parse(input)
}
