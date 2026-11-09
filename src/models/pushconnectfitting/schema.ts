import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(26),
  boreDiameter: positiveLength.default(8),
  length: positiveLength.default(40),
  tubeDiameter: positiveLength.default(12),
  colletDiameter: positiveLength.default(20),
  colletLength: positiveLength.default(6),
  hexAcrossFlats: positiveLength.default(28),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.tubeDiameter))
    issue("Requires boreDiameter < tubeDiameter")
  if (!(p.tubeDiameter < p.colletDiameter))
    issue("Requires tubeDiameter < colletDiameter")
  if (!(p.colletDiameter < p.outerDiameter))
    issue("Requires colletDiameter < outerDiameter")
  if (!(p.outerDiameter < p.hexAcrossFlats))
    issue("Requires outerDiameter < hexAcrossFlats")
  if (!(p.colletLength * 2 < p.length))
    issue("Requires colletLength * 2 < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.tubeDiameter - p.boreDiameter,
    p.colletDiameter - p.tubeDiameter,
    p.outerDiameter - p.colletDiameter,
    p.hexAcrossFlats - p.outerDiameter,
    p.length - p.colletLength * 2,
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
export const pushConnectFittingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pushConnectFittingModelDefinitionSchema = z
  .object({ fn: z.literal("pushconnectfitting"), ...shape })
  .strict()
  .superRefine(validate)
export type PushConnectFittingModelPropsInput = z.input<
  typeof pushConnectFittingModelPropsSchema
>
export type PushConnectFittingModelProps = z.output<
  typeof pushConnectFittingModelPropsSchema
>
export type PushConnectFittingModelDefinition = z.output<
  typeof pushConnectFittingModelDefinitionSchema
>
export function getPushConnectFittingDimensions(
  input: PushConnectFittingModelPropsInput = {},
) {
  return pushConnectFittingModelPropsSchema.parse(input)
}
