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
  thickness: positiveLength,
  length: positiveLength,
  innerRadius: nonnegativeLength.default(0),
  tipRadius: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.thickness >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid anglebar dimensions: constraint 1",
    })
  if (p.innerRadius >= Math.min(p.width, p.height) - p.thickness)
    context.addIssue({
      code: "custom",
      message: "Invalid anglebar dimensions: constraint 2",
    })
  if (2 * p.tipRadius >= p.thickness)
    context.addIssue({
      code: "custom",
      message: "Invalid anglebar dimensions: constraint 3",
    })
  if (p.innerRadius + p.tipRadius >= Math.min(p.width, p.height) - p.thickness)
    context.addIssue({
      code: "custom",
      message: "Invalid anglebar dimensions: constraint 4",
    })
}
export const angleBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const angleBarModelDefinitionSchema = z
  .object({ fn: z.literal("anglebar"), ...shape })
  .strict()
  .superRefine(validate)
export type AngleBarModelPropsInput = z.input<typeof angleBarModelPropsSchema>
export type AngleBarModelProps = z.output<typeof angleBarModelPropsSchema>
export type AngleBarModelDefinition = z.output<
  typeof angleBarModelDefinitionSchema
>

/** L-section stock, centered envelope on XY with the outside corner at minimum X/Y. Inner root and four free-tip corners accept circular fillets. Length runs along +Z. All normalized lengths are millimeters. */
export function getAngleBarDimensions(input: AngleBarModelPropsInput) {
  const p = angleBarModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
  }
}
