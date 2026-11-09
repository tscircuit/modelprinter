import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  outerDiameter: positiveLength.default(6),
  length: positiveLength.default(20),
  wallThickness: positiveLength.default(1),
  gapWidth: positiveLength.default(1),
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
      p.wallThickness,
      (p.outerDiameter - 2 * p.wallThickness - p.gapWidth) / 2,
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
      2 * p.wallThickness < p.outerDiameter &&
      p.gapWidth < p.outerDiameter - 2 * p.wallThickness
    )
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid springpin dimensions: mating features must fit within the body",
    })
}
export const springPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const springPinModelDefinitionSchema = z
  .object({ fn: z.literal("springpin"), ...shape })
  .strict()
  .superRefine(validate)
export type SpringPinModelPropsInput = z.input<typeof springPinModelPropsSchema>
export type SpringPinModelProps = z.output<typeof springPinModelPropsSchema>
export type SpringPinModelDefinition = z.output<
  typeof springPinModelDefinitionSchema
>
export function getSpringPinDimensions(input: SpringPinModelPropsInput = {}) {
  return springPinModelPropsSchema.parse(input)
}
