import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"

/** Nominal visual dimensions in millimeters; threads use smooth envelopes. */
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.0001 && value <= 10000,
  "Length must be in [0.0001, 10000] mm",
)
const shape = {
  wireDiameter: positiveLength.default(2),
  length: positiveLength.default(40),
  loopDiameter: positiveLength.default(10),
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
      (p.loopDiameter - 3 * p.wireDiameter) / 2,
      p.length - 2 * p.loopDiameter,
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
  if (!(p.wireDiameter * 3 < p.loopDiameter && p.length > p.loopDiameter * 2))
    ctx.addIssue({
      code: "custom",
      message:
        "Invalid hairpincotter dimensions: mating features must fit within the body",
    })
}
export const hairpinCotterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hairpinCotterModelDefinitionSchema = z
  .object({ fn: z.literal("hairpincotter"), ...shape })
  .strict()
  .superRefine(validate)
export type HairpinCotterModelPropsInput = z.input<
  typeof hairpinCotterModelPropsSchema
>
export type HairpinCotterModelProps = z.output<
  typeof hairpinCotterModelPropsSchema
>
export type HairpinCotterModelDefinition = z.output<
  typeof hairpinCotterModelDefinitionSchema
>
export function getHairpinCotterDimensions(
  input: HairpinCotterModelPropsInput = {},
) {
  return hairpinCotterModelPropsSchema.parse(input)
}
