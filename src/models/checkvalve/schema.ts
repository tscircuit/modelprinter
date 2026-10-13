import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(28),
  boreDiameter: positiveLength.default(12),
  length: positiveLength.default(60),
  endDiameter: positiveLength.default(20),
  hexAcrossFlats: positiveLength.default(30),
  nutLength: positiveLength.default(12),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.endDiameter))
    issue("Requires boreDiameter < endDiameter")
  if (!(p.endDiameter < p.outerDiameter))
    issue("Requires endDiameter < outerDiameter")
  if (!(p.outerDiameter < p.hexAcrossFlats))
    issue("Requires outerDiameter < hexAcrossFlats")
  if (!(p.nutLength * 2 < p.length)) issue("Requires nutLength * 2 < length")
  if (!(p.outerDiameter < p.length)) issue("Requires outerDiameter < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.endDiameter - p.boreDiameter,
    p.outerDiameter - p.endDiameter,
    p.hexAcrossFlats - p.outerDiameter,
    p.length - p.nutLength * 2,
    p.length - p.outerDiameter,
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
export const checkValveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const checkValveModelDefinitionSchema = z
  .object({ fn: z.literal("checkvalve"), ...shape })
  .strict()
  .superRefine(validate)
export type CheckValveModelPropsInput = z.input<
  typeof checkValveModelPropsSchema
>
export type CheckValveModelProps = z.output<typeof checkValveModelPropsSchema>
export type CheckValveModelDefinition = z.output<
  typeof checkValveModelDefinitionSchema
>
export function getCheckValveDimensions(input: CheckValveModelPropsInput = {}) {
  return checkValveModelPropsSchema.parse(input)
}
