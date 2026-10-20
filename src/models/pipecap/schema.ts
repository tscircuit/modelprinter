import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  socketDiameter: positiveLength.default(20),
  length: positiveLength.default(25),
  floorThickness: positiveLength.default(4),
  hexAcrossFlats: positiveLength.default(32),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.socketDiameter < p.outerDiameter))
    issue("Requires socketDiameter < outerDiameter")
  if (!(p.outerDiameter < p.hexAcrossFlats))
    issue("Requires outerDiameter < hexAcrossFlats")
  if (!(p.floorThickness < p.length)) issue("Requires floorThickness < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.outerDiameter - p.socketDiameter,
    p.hexAcrossFlats - p.outerDiameter,
    p.length - p.floorThickness,
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
export const pipeCapModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pipeCapModelDefinitionSchema = z
  .object({ fn: z.literal("pipecap"), ...shape })
  .strict()
  .superRefine(validate)
export type PipeCapModelPropsInput = z.input<typeof pipeCapModelPropsSchema>
export type PipeCapModelProps = z.output<typeof pipeCapModelPropsSchema>
export type PipeCapModelDefinition = z.output<
  typeof pipeCapModelDefinitionSchema
>
export function getPipeCapDimensions(input: PipeCapModelPropsInput = {}) {
  return pipeCapModelPropsSchema.parse(input)
}
