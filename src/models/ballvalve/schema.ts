import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  boreDiameter: positiveLength.default(16),
  length: positiveLength.default(65),
  endDiameter: positiveLength.default(24),
  handleLength: positiveLength.default(55),
  handleWidth: positiveLength.default(10),
  stemHeight: positiveLength.default(14),
  handleThickness: positiveLength.default(4),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.endDiameter))
    issue("Requires boreDiameter < endDiameter")
  if (!(p.endDiameter < p.outerDiameter))
    issue("Requires endDiameter < outerDiameter")
  if (!(p.outerDiameter * 2 < p.length))
    issue("Requires outerDiameter * 2 < length")
  if (!(p.handleWidth < p.outerDiameter))
    issue("Requires handleWidth < outerDiameter")
  if (!(p.handleThickness < p.stemHeight))
    issue("Requires handleThickness < stemHeight")
  if (!(p.handleLength > p.outerDiameter))
    issue("Requires handleLength > outerDiameter")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.endDiameter - p.boreDiameter,
    p.outerDiameter - p.endDiameter,
    p.length - p.outerDiameter * 2,
    p.outerDiameter - p.handleWidth,
    p.stemHeight - p.handleThickness,
    p.handleLength - p.outerDiameter,
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
export const ballValveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const ballValveModelDefinitionSchema = z
  .object({ fn: z.literal("ballvalve"), ...shape })
  .strict()
  .superRefine(validate)
export type BallValveModelPropsInput = z.input<typeof ballValveModelPropsSchema>
export type BallValveModelProps = z.output<typeof ballValveModelPropsSchema>
export type BallValveModelDefinition = z.output<
  typeof ballValveModelDefinitionSchema
>
export function getBallValveDimensions(input: BallValveModelPropsInput = {}) {
  return ballValveModelPropsSchema.parse(input)
}
