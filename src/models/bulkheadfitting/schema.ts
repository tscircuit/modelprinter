import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(20),
  boreDiameter: positiveLength.default(12),
  length: positiveLength.default(55),
  flangeDiameter: positiveLength.default(32),
  flangeThickness: positiveLength.default(4),
  nutAcrossFlats: positiveLength.default(28),
  nutThickness: positiveLength.default(8),
  panelGap: positiveLength.default(10),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.outerDiameter))
    issue("Requires boreDiameter < outerDiameter")
  if (!(p.outerDiameter < p.nutAcrossFlats))
    issue("Requires outerDiameter < nutAcrossFlats")
  if (!(p.nutAcrossFlats < p.flangeDiameter))
    issue("Requires nutAcrossFlats < flangeDiameter")
  if (!(p.panelGap + p.flangeThickness + p.nutThickness < p.length))
    issue("Requires panelGap + flangeThickness + nutThickness < length")
  if (
    p.panelGap + p.flangeThickness * 2 >= p.length ||
    p.panelGap + p.nutThickness * 2 >= p.length
  )
    issue("Flange and nut must remain on the axial body")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.outerDiameter - p.boreDiameter,
    p.nutAcrossFlats - p.outerDiameter,
    p.flangeDiameter - p.nutAcrossFlats,
    p.length - (p.panelGap + p.flangeThickness + p.nutThickness),
    p.length - p.panelGap - p.flangeThickness * 2,
    p.length - p.panelGap - p.nutThickness * 2,
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
export const bulkheadFittingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const bulkheadFittingModelDefinitionSchema = z
  .object({ fn: z.literal("bulkheadfitting"), ...shape })
  .strict()
  .superRefine(validate)
export type BulkheadFittingModelPropsInput = z.input<
  typeof bulkheadFittingModelPropsSchema
>
export type BulkheadFittingModelProps = z.output<
  typeof bulkheadFittingModelPropsSchema
>
export type BulkheadFittingModelDefinition = z.output<
  typeof bulkheadFittingModelDefinitionSchema
>
export function getBulkheadFittingDimensions(
  input: BulkheadFittingModelPropsInput = {},
) {
  return bulkheadFittingModelPropsSchema.parse(input)
}
