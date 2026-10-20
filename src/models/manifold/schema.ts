import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  length: positiveLength.default(100),
  width: positiveLength.default(30),
  height: positiveLength.default(26),
  boreDiameter: positiveLength.default(12),
  portDiameter: positiveLength.default(8),
  portPitch: positiveLength.default(25),
  portCount: z.number().int().min(2).max(12).default(3),
  mountingHoleDiameter: positiveLength.default(5),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (!(p.boreDiameter < p.width)) issue("Requires boreDiameter < width")
  if (!(p.boreDiameter < p.height)) issue("Requires boreDiameter < height")
  if (!(p.portDiameter < p.boreDiameter))
    issue("Requires portDiameter < boreDiameter")
  if (!(p.portDiameter < p.portPitch))
    issue("Requires portDiameter < portPitch")
  if (!(p.portPitch * (p.portCount - 1) + p.portDiameter < p.length))
    issue("Requires portPitch * (portCount - 1) + portDiameter < length")
  if (!(p.mountingHoleDiameter * 3 + p.boreDiameter < p.width))
    issue("Requires mountingHoleDiameter * 2 + boreDiameter < width")
  if (!(p.mountingHoleDiameter * 2 < p.portPitch))
    issue("Requires mountingHoleDiameter * 2 < portPitch")
  if (p.mountingHoleDiameter * 4 >= p.length)
    issue("Mounting holes must remain within the manifold end faces")
  const dimensions = Object.keys(shape)
    .filter((key) => !key.endsWith("Count"))
    .map((key) => p[key as keyof Resolved])
  const minimumGap = Math.max(...dimensions) * 1e-4
  const clearances = [
    p.width - p.boreDiameter,
    p.height - p.boreDiameter,
    p.boreDiameter - p.portDiameter,
    p.portPitch - p.portDiameter,
    p.length - (p.portPitch * (p.portCount - 1) + p.portDiameter),
    p.width - (p.mountingHoleDiameter * 2 + p.boreDiameter),
    p.portPitch - p.mountingHoleDiameter * 2,
    p.width - p.boreDiameter - p.mountingHoleDiameter * 3,
    p.length - p.mountingHoleDiameter * 4,
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
export const manifoldModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const manifoldModelDefinitionSchema = z
  .object({ fn: z.literal("manifold"), ...shape })
  .strict()
  .superRefine(validate)
export type ManifoldModelPropsInput = z.input<typeof manifoldModelPropsSchema>
export type ManifoldModelProps = z.output<typeof manifoldModelPropsSchema>
export type ManifoldModelDefinition = z.output<
  typeof manifoldModelDefinitionSchema
>
export function getManifoldDimensions(input: ManifoldModelPropsInput = {}) {
  return manifoldModelPropsSchema.parse(input)
}
