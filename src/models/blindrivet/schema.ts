import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  bodyDiameter: positiveLength.default(4),
  bodyLength: positiveLength.default(10),
  flangeDiameter: positiveLength.default(8),
  flangeThickness: positiveLength.default(1.2),
  mandrelDiameter: positiveLength.default(2),
  mandrelLength: positiveLength.default(20),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![
      (p.bodyDiameter - p.mandrelDiameter * 1.1) / 2,
      (p.flangeDiameter - p.bodyDiameter) / 2,
    ].every((gap) => gap >= extent * 0.0001)
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
      p.mandrelDiameter < p.bodyDiameter &&
      p.bodyDiameter < p.flangeDiameter &&
      p.mandrelLength > p.bodyLength &&
      p.flangeThickness < p.bodyLength
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid blindrivet dimensions: mating features must fit within the body",
    })
}
export const blindRivetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const blindRivetModelDefinitionSchema = z
  .object({ fn: z.literal("blindrivet"), ...shape })
  .strict()
  .superRefine(validate)
export type BlindRivetModelPropsInput = z.input<
  typeof blindRivetModelPropsSchema
>
export type BlindRivetModelProps = z.output<typeof blindRivetModelPropsSchema>
export type BlindRivetModelDefinition = z.output<
  typeof blindRivetModelDefinitionSchema
>
export function getBlindRivetDimensions(input: BlindRivetModelPropsInput = {}) {
  return blindRivetModelPropsSchema.parse(input)
}
