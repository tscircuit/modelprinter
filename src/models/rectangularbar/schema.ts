import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

// Strict decimal lengths prevent permissive unit conversion from hiding typos.
const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)
const shape = {
  width: positiveLength,
  height: positiveLength,
  length: positiveLength,
  cornerRadius: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.cornerRadius * 2 >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid rectangularbar dimensions: constraint 1",
    })
}
export const rectangularBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rectangularBarModelDefinitionSchema = z
  .object({ fn: z.literal("rectangularbar"), ...shape })
  .strict()
  .superRefine(validate)
export type RectangularBarModelPropsInput = z.input<
  typeof rectangularBarModelPropsSchema
>
export type RectangularBarModelProps = z.output<
  typeof rectangularBarModelPropsSchema
>
export type RectangularBarModelDefinition = z.output<
  typeof rectangularBarModelDefinitionSchema
>

/** Solid rectangular stock with optional longitudinal corner radii. Cross section is centered on XY; open length direction is +Z. All normalized lengths are millimeters. */
export function getRectangularBarDimensions(
  input: RectangularBarModelPropsInput,
) {
  const p = rectangularBarModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
  }
}
