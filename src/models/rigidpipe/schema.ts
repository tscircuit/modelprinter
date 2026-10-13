import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(20),
  boreDiameter: positiveLength.default(16),
  length: positiveLength.default(100),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.outerDiameter))
    issue("Requires boreDiameter < outerDiameter")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [p.outerDiameter - p.boreDiameter]
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
export const rigidPipeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rigidPipeModelDefinitionSchema = z
  .object({ fn: z.literal("rigidpipe"), ...shape })
  .strict()
  .superRefine(validate)
export type RigidPipeModelPropsInput = z.input<typeof rigidPipeModelPropsSchema>
export type RigidPipeModelProps = z.output<typeof rigidPipeModelPropsSchema>
export type RigidPipeModelDefinition = z.output<
  typeof rigidPipeModelDefinitionSchema
>
export function getRigidPipeDimensions(input: RigidPipeModelPropsInput = {}) {
  return rigidPipeModelPropsSchema.parse(input)
}
