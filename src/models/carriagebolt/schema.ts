import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  shaftDiameter: positiveLength.default(6),
  shaftLength: positiveLength.default(25),
  neckWidth: positiveLength.default(6.5),
  neckHeight: positiveLength.default(3),
  headDiameter: positiveLength.default(14),
  headHeight: positiveLength.default(4),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![(p.headDiameter - p.neckWidth * Math.SQRT2) / 2].every(
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
      p.shaftDiameter <= p.neckWidth &&
      p.neckWidth * Math.SQRT2 < p.headDiameter &&
      p.headHeight < p.headDiameter / 2
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid carriagebolt dimensions: mating features must fit within the body",
    })
}
export const carriageBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const carriageBoltModelDefinitionSchema = z
  .object({ fn: z.literal("carriagebolt"), ...shape })
  .strict()
  .superRefine(validate)
export type CarriageBoltModelPropsInput = z.input<
  typeof carriageBoltModelPropsSchema
>
export type CarriageBoltModelProps = z.output<
  typeof carriageBoltModelPropsSchema
>
export type CarriageBoltModelDefinition = z.output<
  typeof carriageBoltModelDefinitionSchema
>
export function getCarriageBoltDimensions(
  input: CarriageBoltModelPropsInput = {},
) {
  return carriageBoltModelPropsSchema.parse(input)
}
