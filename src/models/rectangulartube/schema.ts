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
  wallThickness: positiveLength,
  length: positiveLength,
  outerRadius: nonnegativeLength.default(0),
  innerRadius: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (2 * p.wallThickness >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid rectangulartube dimensions: constraint 1",
    })
  if (2 * p.outerRadius >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid rectangulartube dimensions: constraint 2",
    })
  if (2 * p.innerRadius >= Math.min(p.width, p.height) - 2 * p.wallThickness)
    context.addIssue({
      code: "custom",
      message: "Invalid rectangulartube dimensions: constraint 3",
    })
  if (p.wallThickness <= (1 - Math.SQRT1_2) * (p.outerRadius - p.innerRadius))
    context.addIssue({
      code: "custom",
      message: "Invalid rectangulartube dimensions: constraint 4",
    })
}
export const rectangularTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rectangularTubeModelDefinitionSchema = z
  .object({ fn: z.literal("rectangulartube"), ...shape })
  .strict()
  .superRefine(validate)
export type RectangularTubeModelPropsInput = z.input<
  typeof rectangularTubeModelPropsSchema
>
export type RectangularTubeModelProps = z.output<
  typeof rectangularTubeModelPropsSchema
>
export type RectangularTubeModelDefinition = z.output<
  typeof rectangularTubeModelDefinitionSchema
>

/** Open rectangular stock tube. Outer and inner radii are independent; minimum corner clearance is validated. Section centered on XY, ends Z=0 and Z=length. All normalized lengths are millimeters. */
export function getRectangularTubeDimensions(
  input: RectangularTubeModelPropsInput,
) {
  const p = rectangularTubeModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
  }
}
