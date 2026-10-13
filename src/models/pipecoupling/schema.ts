import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  boreDiameter: positiveLength.default(16),
  socketDiameter: positiveLength.default(20),
  length: positiveLength.default(40),
  socketDepth: positiveLength.default(14),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.socketDiameter))
    issue("Requires boreDiameter < socketDiameter")
  if (!(p.socketDiameter < p.outerDiameter))
    issue("Requires socketDiameter < outerDiameter")
  if (!(p.socketDepth * 2 < p.length))
    issue("Requires socketDepth * 2 < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.socketDiameter - p.boreDiameter,
    p.outerDiameter - p.socketDiameter,
    p.length - p.socketDepth * 2,
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
export const pipeCouplingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeCouplingModelDefinitionSchema = z
  .object({ fn: z.literal("pipecoupling"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeCouplingModelPropsInput = z.input<
  typeof pipeCouplingModelPropsSchema
>
export type PipeCouplingModelProps = z.output<
  typeof pipeCouplingModelPropsSchema
>
export type PipeCouplingModelDefinition = z.output<
  typeof pipeCouplingModelDefinitionSchema
>
export function getPipeCouplingDimensions(
  input: PipeCouplingModelPropsInput = {},
) {
  return pipeCouplingModelPropsSchema.parse(input)
}
