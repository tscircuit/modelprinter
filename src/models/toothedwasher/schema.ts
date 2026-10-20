import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  innerDiameter: positiveLength.default(6.4),
  outerDiameter: positiveLength.default(13),
  thickness: positiveLength.default(0.8),
  toothDepth: positiveLength.default(1.5),
}
const validate = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const extent = Math.max(
    ...Object.values(p).filter((value) => typeof value === "number"),
  )
  if (
    ![(p.outerDiameter - p.innerDiameter - 2 * p.toothDepth) / 2].every(
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
  if (!(p.innerDiameter < p.outerDiameter - 2 * p.toothDepth))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid toothedwasher dimensions: mating features must fit within the body",
    })
}
export const toothedWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const toothedWasherModelDefinitionSchema = z
  .object({ fn: z.literal("toothedwasher"), ...shape })
  .strict()
  .superRefine(validate)
export type ToothedWasherModelPropsInput = z.input<
  typeof toothedWasherModelPropsSchema
>
export type ToothedWasherModelProps = z.output<
  typeof toothedWasherModelPropsSchema
>
export type ToothedWasherModelDefinition = z.output<
  typeof toothedWasherModelDefinitionSchema
>
export function getToothedWasherDimensions(
  input: ToothedWasherModelPropsInput = {},
) {
  return toothedWasherModelPropsSchema.parse(input)
}
