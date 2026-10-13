import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(24),
  boreDiameter: positiveLength.default(16),
  length: positiveLength.default(70),
  branchLength: positiveLength.default(35),
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
  if (!(p.socketLength * 2 < p.length))
    issue("Requires socketLength * 2 < length")
  if (!(p.socketLength < p.branchLength))
    issue("Requires socketLength < branchLength")
  if (!(p.outerDiameter < p.branchLength))
    issue("Requires outerDiameter < branchLength")
  if (!(p.outerDiameter * 2 < p.length))
    issue("Requires outerDiameter * 2 < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.outerDiameter - p.boreDiameter,
    p.socketDiameter - p.outerDiameter,
    p.length - p.socketLength * 2,
    p.branchLength - p.socketLength,
    p.branchLength - p.outerDiameter,
    p.length - p.outerDiameter * 2,
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
export const pipeTeeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeTeeModelDefinitionSchema = z
  .object({ fn: z.literal("pipetee"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeTeeModelPropsInput = z.input<typeof pipeTeeModelPropsSchema>
export type PipeTeeModelProps = z.output<typeof pipeTeeModelPropsSchema>
export type PipeTeeModelDefinition = z.output<
  typeof pipeTeeModelDefinitionSchema
>
export function getPipeTeeDimensions(input: PipeTeeModelPropsInput = {}) {
  return pipeTeeModelPropsSchema.parse(input)
}
