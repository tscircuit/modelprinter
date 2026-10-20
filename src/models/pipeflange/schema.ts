import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  flangeDiameter: positiveLength.default(70),
  boreDiameter: positiveLength.default(16),
  hubDiameter: positiveLength.default(30),
  flangeThickness: positiveLength.default(8),
  hubLength: positiveLength.default(20),
  boltCircleDiameter: positiveLength.default(50),
  boltHoleDiameter: positiveLength.default(6),
  boltCount: z.number().int().min(2).max(12).default(4),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.hubDiameter))
    issue("Requires boreDiameter < hubDiameter")
  if (!(p.hubDiameter + p.boltHoleDiameter < p.boltCircleDiameter))
    issue("Requires hubDiameter + boltHoleDiameter < boltCircleDiameter")
  if (!(p.boltCircleDiameter + p.boltHoleDiameter < p.flangeDiameter))
    issue("Requires boltCircleDiameter + boltHoleDiameter < flangeDiameter")
  if (
    !(
      p.boltHoleDiameter * 2 <
      p.boltCircleDiameter * Math.sin(Math.PI / p.boltCount)
    )
  )
    issue(
      "Requires boltHoleDiameter * 2 < boltCircleDiameter * Math.sin(Math.PI / boltCount)",
    )
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.hubDiameter - p.boreDiameter,
    p.boltCircleDiameter - (p.hubDiameter + p.boltHoleDiameter),
    p.flangeDiameter - (p.boltCircleDiameter + p.boltHoleDiameter),
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
export const pipeFlangeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeFlangeModelDefinitionSchema = z
  .object({ fn: z.literal("pipeflange"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeFlangeModelPropsInput = z.input<
  typeof pipeFlangeModelPropsSchema
>
export type PipeFlangeModelProps = z.output<typeof pipeFlangeModelPropsSchema>
export type PipeFlangeModelDefinition = z.output<
  typeof pipeFlangeModelDefinitionSchema
>
export function getPipeFlangeDimensions(input: PipeFlangeModelPropsInput = {}) {
  return pipeFlangeModelPropsSchema.parse(input)
}
