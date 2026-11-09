import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  shaftDiameter: positiveLength.default(6),
  shaftLength: positiveLength.default(24),
  eyeInnerDiameter: positiveLength.default(14),
  eyeWireDiameter: positiveLength.default(5),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![p.eyeInnerDiameter - p.eyeWireDiameter].every(
      (gap) => gap >= extent * 0.0001,
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Material and clearance gaps must exceed 0.0001 times the model envelope",
    })
  if (Object.values(p).some((value) => value < extent * 0.0001))
    ctx.addIssue({
      code: "custom",
      message:
        "Dimensions are too small relative to the model envelope for stable geometry",
    })
  if (
    !(
      p.eyeWireDiameter < p.eyeInnerDiameter &&
      p.shaftDiameter < p.eyeInnerDiameter
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid eyebolt dimensions: mating features must fit within the body",
    })
}
export const eyeBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const eyeBoltModelDefinitionSchema = z
  .object({ fn: z.literal("eyebolt"), ...shape })
  .strict()
  .superRefine(validate)
export type EyeBoltModelPropsInput = z.input<typeof eyeBoltModelPropsSchema>
export type EyeBoltModelProps = z.output<typeof eyeBoltModelPropsSchema>
export type EyeBoltModelDefinition = z.output<
  typeof eyeBoltModelDefinitionSchema
>
export function getEyeBoltDimensions(input: EyeBoltModelPropsInput = {}) {
  return eyeBoltModelPropsSchema.parse(input)
}
