import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(20),
  boreDiameter: positiveLength.default(16),
  length: positiveLength.default(50),
  threadLength: positiveLength.default(12),
  shoulderDiameter: positiveLength.default(22),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.outerDiameter))
    issue("Requires boreDiameter < outerDiameter")
  if (!(p.outerDiameter < p.shoulderDiameter))
    issue("Requires outerDiameter < shoulderDiameter")
  if (!(p.threadLength * 2 < p.length))
    issue("Requires threadLength * 2 < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.outerDiameter - p.boreDiameter,
    p.shoulderDiameter - p.outerDiameter,
    p.length - p.threadLength * 2,
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
export const pipeNippleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeNippleModelDefinitionSchema = z
  .object({ fn: z.literal("pipenipple"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeNippleModelPropsInput = z.input<
  typeof pipeNippleModelPropsSchema
>
export type PipeNippleModelProps = z.output<typeof pipeNippleModelPropsSchema>
export type PipeNippleModelDefinition = z.output<
  typeof pipeNippleModelDefinitionSchema
>
export function getPipeNippleDimensions(input: PipeNippleModelPropsInput = {}) {
  return pipeNippleModelPropsSchema.parse(input)
}
