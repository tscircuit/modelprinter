import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  width: positiveLength.default(8),
  height: positiveLength.default(8),
  length: positiveLength.default(40),
  chamfer: positiveLength.default(1),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.length > p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid squarekey dimensions: length > width",
    })
  if (!(p.chamfer < Math.min(p.width, p.length) / 3))
    context.addIssue({
      code: "custom",
      message:
        "Invalid squarekey dimensions: chamfer < Math.min(width,length)/3",
    })
}
export const squareKeyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const squareKeyModelDefinitionSchema = z
  .object({ fn: z.literal("squarekey"), ...shape })
  .strict()
  .superRefine(validate)
export type SquareKeyModelPropsInput = z.input<typeof squareKeyModelPropsSchema>
export type SquareKeyModelProps = z.output<typeof squareKeyModelPropsSchema>
export type SquareKeyModelDefinition = z.output<
  typeof squareKeyModelDefinitionSchema
>
/** Parallel shaft key, length X, width Y, height Z; clipped plan corners, bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getSquareKeyDimensions(input: SquareKeyModelPropsInput = {}) {
  return squareKeyModelPropsSchema.parse(input)
}
