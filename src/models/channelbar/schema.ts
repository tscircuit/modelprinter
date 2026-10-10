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
  webThickness: positiveLength,
  flangeThickness: positiveLength,
  length: positiveLength,
  innerRadius: nonnegativeLength.default(0),
  tipRadius: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (2 * p.flangeThickness >= p.width)
    context.addIssue({
      code: "custom",
      message: "Invalid channelbar dimensions: constraint 1",
    })
  if (p.webThickness >= p.height)
    context.addIssue({
      code: "custom",
      message: "Invalid channelbar dimensions: constraint 2",
    })
  if (2 * p.innerRadius >= p.width - 2 * p.flangeThickness)
    context.addIssue({
      code: "custom",
      message: "Invalid channelbar dimensions: constraint 3",
    })
  if (p.innerRadius + p.tipRadius >= p.height - p.webThickness)
    context.addIssue({
      code: "custom",
      message: "Invalid channelbar dimensions: constraint 4",
    })
  if (2 * p.tipRadius >= p.flangeThickness)
    context.addIssue({
      code: "custom",
      message: "Invalid channelbar dimensions: constraint 5",
    })
}
export const channelBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const channelBarModelDefinitionSchema = z
  .object({ fn: z.literal("channelbar"), ...shape })
  .strict()
  .superRefine(validate)
export type ChannelBarModelPropsInput = z.input<
  typeof channelBarModelPropsSchema
>
export type ChannelBarModelProps = z.output<typeof channelBarModelPropsSchema>
export type ChannelBarModelDefinition = z.output<
  typeof channelBarModelDefinitionSchema
>

/** U-section stock centered on XY, opening toward +Y, length along +Z. Root radii and four free-tip radii preserve the outer envelope. All normalized lengths are millimeters. */
export function getChannelBarDimensions(input: ChannelBarModelPropsInput) {
  const p = channelBarModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
  }
}
