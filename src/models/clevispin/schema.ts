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
  headDiameter: positiveLength.default(10),
  headHeight: positiveLength.default(2),
  holeDiameter: positiveLength.default(2),
  holeOffset: positiveLength.default(3),
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
      (p.shaftDiameter - p.holeDiameter) / 2,
      p.holeOffset - p.holeDiameter / 2,
      p.shaftLength - p.holeOffset - p.holeDiameter / 2,
      (p.headDiameter - p.shaftDiameter) / 2,
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
      p.shaftDiameter < p.headDiameter &&
      p.holeDiameter < p.shaftDiameter &&
      p.holeOffset > p.holeDiameter / 2 &&
      p.holeOffset + p.holeDiameter / 2 < p.shaftLength
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid clevispin dimensions: mating features must fit within the body",
    })
}
export const clevisPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const clevisPinModelDefinitionSchema = z
  .object({ fn: z.literal("clevispin"), ...shape })
  .strict()
  .superRefine(validate)
export type ClevisPinModelPropsInput = z.input<typeof clevisPinModelPropsSchema>
export type ClevisPinModelProps = z.output<typeof clevisPinModelPropsSchema>
export type ClevisPinModelDefinition = z.output<
  typeof clevisPinModelDefinitionSchema
>
export function getClevisPinDimensions(input: ClevisPinModelPropsInput = {}) {
  return clevisPinModelPropsSchema.parse(input)
}
