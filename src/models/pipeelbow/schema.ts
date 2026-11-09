import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(24),
  boreDiameter: positiveLength.default(16),
  legLength: positiveLength.default(36),
  socketDiameter: positiveLength.default(28),
  socketLength: positiveLength.default(10),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.outerDiameter))
    issue("Requires boreDiameter < outerDiameter")
  if (!(p.outerDiameter < p.socketDiameter))
    issue("Requires outerDiameter < socketDiameter")
  if (!(p.socketLength < p.legLength))
    issue("Requires socketLength < legLength")
  if (!(p.outerDiameter < p.legLength))
    issue("Requires outerDiameter < legLength")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.outerDiameter - p.boreDiameter,
    p.socketDiameter - p.outerDiameter,
    p.legLength - p.socketLength,
    p.legLength - p.outerDiameter,
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
export const pipeElbowModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeElbowModelDefinitionSchema = z
  .object({ fn: z.literal("pipeelbow"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeElbowModelPropsInput = z.input<typeof pipeElbowModelPropsSchema>
export type PipeElbowModelProps = z.output<typeof pipeElbowModelPropsSchema>
export type PipeElbowModelDefinition = z.output<
  typeof pipeElbowModelDefinitionSchema
>
export function getPipeElbowDimensions(input: PipeElbowModelPropsInput = {}) {
  return pipeElbowModelPropsSchema.parse(input)
}
