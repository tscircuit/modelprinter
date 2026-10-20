import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(26),
  largeBoreDiameter: positiveLength.default(18),
  smallBoreDiameter: positiveLength.default(10),
  length: positiveLength.default(30),
  hexAcrossFlats: positiveLength.default(30),
  hexLength: positiveLength.default(10),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.smallBoreDiameter < p.largeBoreDiameter))
    issue("Requires smallBoreDiameter < largeBoreDiameter")
  if (!(p.largeBoreDiameter < p.outerDiameter))
    issue("Requires largeBoreDiameter < outerDiameter")
  if (!(p.outerDiameter < p.hexAcrossFlats))
    issue("Requires outerDiameter < hexAcrossFlats")
  if (!(p.hexLength < p.length)) issue("Requires hexLength < length")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.largeBoreDiameter - p.smallBoreDiameter,
    p.outerDiameter - p.largeBoreDiameter,
    p.hexAcrossFlats - p.outerDiameter,
    p.length - p.hexLength,
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
export const reducingBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const reducingBushingModelDefinitionSchema = z
  .object({ fn: z.literal("reducingbushing"), ...shape })
  .strict()
  .superRefine(validate)
export type ReducingBushingModelPropsInput = z.input<
  typeof reducingBushingModelPropsSchema
>
export type ReducingBushingModelProps = z.output<
  typeof reducingBushingModelPropsSchema
>
export type ReducingBushingModelDefinition = z.output<
  typeof reducingBushingModelDefinitionSchema
>
export function getReducingBushingDimensions(
  input: ReducingBushingModelPropsInput = {},
) {
  return reducingBushingModelPropsSchema.parse(input)
}
