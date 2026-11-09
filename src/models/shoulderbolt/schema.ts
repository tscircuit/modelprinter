import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  shoulderDiameter: positiveLength.default(8),
  shoulderLength: positiveLength.default(20),
  threadDiameter: positiveLength.default(6),
  threadLength: positiveLength.default(10),
  headDiameter: positiveLength.default(13),
  headHeight: positiveLength.default(5),
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
      (p.shoulderDiameter - p.threadDiameter) / 2,
      (p.headDiameter - p.shoulderDiameter) / 2,
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
      p.threadDiameter < p.shoulderDiameter &&
      p.shoulderDiameter < p.headDiameter &&
      p.headHeight < p.headDiameter
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid shoulderbolt dimensions: mating features must fit within the body",
    })
}
export const shoulderBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const shoulderBoltModelDefinitionSchema = z
  .object({ fn: z.literal("shoulderbolt"), ...shape })
  .strict()
  .superRefine(validate)
export type ShoulderBoltModelPropsInput = z.input<
  typeof shoulderBoltModelPropsSchema
>
export type ShoulderBoltModelProps = z.output<
  typeof shoulderBoltModelPropsSchema
>
export type ShoulderBoltModelDefinition = z.output<
  typeof shoulderBoltModelDefinitionSchema
>
export function getShoulderBoltDimensions(
  input: ShoulderBoltModelPropsInput = {},
) {
  return shoulderBoltModelPropsSchema.parse(input)
}
