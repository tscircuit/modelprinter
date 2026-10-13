import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  boreDiameter: positiveLength.default(16),
  length: positiveLength.default(55),
  nutAcrossFlats: positiveLength.default(36),
  nutLength: positiveLength.default(20),
  endDiameter: positiveLength.default(24),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.endDiameter))
    issue("Requires boreDiameter < endDiameter")
  if (!(p.endDiameter < p.outerDiameter))
    issue("Requires endDiameter < outerDiameter")
  if (!(p.outerDiameter < p.nutAcrossFlats))
    issue("Requires outerDiameter < nutAcrossFlats")
  if (!(p.nutLength * 1.25 < p.length)) issue("Requires nutLength < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.endDiameter - p.boreDiameter,
    p.outerDiameter - p.endDiameter,
    p.nutAcrossFlats - p.outerDiameter,
    p.length - p.nutLength,
    p.length - p.nutLength * 1.25,
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
export const pipeUnionModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeUnionModelDefinitionSchema = z
  .object({ fn: z.literal("pipeunion"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeUnionModelPropsInput = z.input<typeof pipeUnionModelPropsSchema>
export type PipeUnionModelProps = z.output<typeof pipeUnionModelPropsSchema>
export type PipeUnionModelDefinition = z.output<
  typeof pipeUnionModelDefinitionSchema
>
export function getPipeUnionDimensions(input: PipeUnionModelPropsInput = {}) {
  return pipeUnionModelPropsSchema.parse(input)
}
