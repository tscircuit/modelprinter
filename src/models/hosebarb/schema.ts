import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(20),
  boreDiameter: positiveLength.default(10),
  length: positiveLength.default(45),
  barbDiameter: positiveLength.default(16),
  barbLength: positiveLength.default(25),
  barbPitch: positiveLength.default(6),
  hexAcrossFlats: positiveLength.default(24),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.barbDiameter * 0.8))
    issue("Requires boreDiameter < barbDiameter * 0.8")
  if (!(p.barbDiameter < p.outerDiameter))
    issue("Requires barbDiameter < outerDiameter")
  if (!(p.outerDiameter < p.hexAcrossFlats))
    issue("Requires outerDiameter < hexAcrossFlats")
  if (!(p.barbLength < p.length)) issue("Requires barbLength < length")
  if (!(p.barbPitch * 2 <= p.barbLength))
    issue("Requires barbPitch * 2 <= barbLength")
  if (!(p.barbLength / p.barbPitch < 30))
    issue("Requires barbLength / barbPitch < 30")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.barbDiameter * 0.8 - p.boreDiameter,
    p.outerDiameter - p.barbDiameter,
    p.hexAcrossFlats - p.outerDiameter,
    p.length - p.barbLength,
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
export const hoseBarbModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hoseBarbModelDefinitionSchema = z
  .object({ fn: z.literal("hosebarb"), ...shape })
  .strict()
  .superRefine(validate)
export type HoseBarbModelPropsInput = z.input<typeof hoseBarbModelPropsSchema>
export type HoseBarbModelProps = z.output<typeof hoseBarbModelPropsSchema>
export type HoseBarbModelDefinition = z.output<
  typeof hoseBarbModelDefinitionSchema
>
export function getHoseBarbDimensions(input: HoseBarbModelPropsInput = {}) {
  return hoseBarbModelPropsSchema.parse(input)
}
