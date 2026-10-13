import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  innerDiameter: positiveLength.default(30),
  bandThickness: positiveLength.default(1.5),
  bandWidth: positiveLength.default(8),
  housingLength: positiveLength.default(14),
  housingWidth: positiveLength.default(8),
  housingHeight: positiveLength.default(7),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.bandThickness * 4 < p.innerDiameter))
    issue("Requires bandThickness * 4 < innerDiameter")
  if (!(p.housingWidth < p.innerDiameter))
    issue("Requires housingWidth < innerDiameter")
  if (!(p.housingLength < p.innerDiameter))
    issue("Requires housingLength < innerDiameter")
  if (!(p.housingHeight < p.innerDiameter))
    issue("Requires housingHeight < innerDiameter")
  if (!(p.bandWidth < p.innerDiameter))
    issue("Requires bandWidth < innerDiameter")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.innerDiameter - p.bandThickness * 4,
    p.innerDiameter - p.housingWidth,
    p.innerDiameter - p.housingLength,
    p.innerDiameter - p.housingHeight,
    p.innerDiameter - p.bandWidth,
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
export const hoseClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hoseClampModelDefinitionSchema = z
  .object({ fn: z.literal("hoseclamp"), ...shape })
  .strict()
  .superRefine(validate)
export type HoseClampModelPropsInput = z.input<typeof hoseClampModelPropsSchema>
export type HoseClampModelProps = z.output<typeof hoseClampModelPropsSchema>
export type HoseClampModelDefinition = z.output<
  typeof hoseClampModelDefinitionSchema
>
export function getHoseClampDimensions(input: HoseClampModelPropsInput = {}) {
  return hoseClampModelPropsSchema.parse(input)
}
