import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  bodyLength: positiveLength.default(38),
  bodyWidth: positiveLength.default(24),
  bodyHeight: positiveLength.default(26),
  boreDiameter: positiveLength.default(8),
  portDiameter: positiveLength.default(16),
  portLength: positiveLength.default(10),
  stemHeight: positiveLength.default(24),
  wheelDiameter: positiveLength.default(26),
  wheelThickness: positiveLength.default(5),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.portDiameter))
    issue("Requires boreDiameter < portDiameter")
  if (!(p.portDiameter < p.bodyWidth))
    issue("Requires portDiameter < bodyWidth")
  if (!(p.portDiameter < p.bodyHeight))
    issue("Requires portDiameter < bodyHeight")
  if (!(p.wheelThickness < p.stemHeight))
    issue("Requires wheelThickness < stemHeight")
  if (!(p.wheelDiameter > p.portDiameter))
    issue("Requires wheelDiameter > portDiameter")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.portDiameter - p.boreDiameter,
    p.bodyWidth - p.portDiameter,
    p.bodyHeight - p.portDiameter,
    p.stemHeight - p.wheelThickness,
    p.wheelDiameter - p.portDiameter,
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
export const needleValveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const needleValveModelDefinitionSchema = z
  .object({ fn: z.literal("needlevalve"), ...shape })
  .strict()
  .superRefine(validate)
export type NeedleValveModelPropsInput = z.input<
  typeof needleValveModelPropsSchema
>
export type NeedleValveModelProps = z.output<typeof needleValveModelPropsSchema>
export type NeedleValveModelDefinition = z.output<
  typeof needleValveModelDefinitionSchema
>
export function getNeedleValveDimensions(
  input: NeedleValveModelPropsInput = {},
) {
  return needleValveModelPropsSchema.parse(input)
}
