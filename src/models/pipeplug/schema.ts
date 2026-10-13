import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  diameter: positiveLength.default(20),
  length: positiveLength.default(20),
  headAcrossFlats: positiveLength.default(26),
  headHeight: positiveLength.default(8),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.diameter < p.headAcrossFlats))
    issue("Requires diameter < headAcrossFlats")
  if (!(p.headHeight < p.length)) issue("Requires headHeight < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [p.headAcrossFlats - p.diameter, p.length - p.headHeight]
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
export const pipePlugModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipePlugModelDefinitionSchema = z
  .object({ fn: z.literal("pipeplug"), ...shape })
  .strict()
  .superRefine(validate)
export type PipePlugModelPropsInput = z.input<typeof pipePlugModelPropsSchema>
export type PipePlugModelProps = z.output<typeof pipePlugModelPropsSchema>
export type PipePlugModelDefinition = z.output<
  typeof pipePlugModelDefinitionSchema
>
export function getPipePlugDimensions(input: PipePlugModelPropsInput = {}) {
  return pipePlugModelPropsSchema.parse(input)
}
