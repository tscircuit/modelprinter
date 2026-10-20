import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  width: positiveLength.default(100),
  length: positiveLength.default(100),
  thickness: positiveLength.default(2),
  diamondWidth: positiveLength.default(15),
  diamondLength: positiveLength.default(30),
  strandWidth: positiveLength.default(2),
  frameWidth: positiveLength.default(3),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.width > 2 * p.diamondWidth))
    context.addIssue({
      code: "custom",
      message: "Invalid expandedmetal dimensions: width > 2*diamondWidth",
    })
  if (!(p.length > 2 * p.diamondLength))
    context.addIssue({
      code: "custom",
      message: "Invalid expandedmetal dimensions: length > 2*diamondLength",
    })
  if (!(p.strandWidth < Math.min(p.diamondWidth, p.diamondLength) / 4))
    context.addIssue({
      code: "custom",
      message:
        "Invalid expandedmetal dimensions: strandWidth < Math.min(diamondWidth,diamondLength)/4",
    })
  if (!(p.frameWidth < Math.min(p.width, p.length) / 8))
    context.addIssue({
      code: "custom",
      message:
        "Invalid expandedmetal dimensions: frameWidth < Math.min(width,length)/8",
    })
  if (!(((p.width / p.diamondWidth) * p.length) / p.diamondLength <= 200))
    context.addIssue({
      code: "custom",
      message:
        "Invalid expandedmetal dimensions: width/diamondWidth*length/diamondLength <= 200",
    })
}
export const expandedMetalModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const expandedMetalModelDefinitionSchema = z
  .object({ fn: z.literal("expandedmetal"), ...shape })
  .strict()
  .superRefine(validate)
export type ExpandedMetalModelPropsInput = z.input<
  typeof expandedMetalModelPropsSchema
>
export type ExpandedMetalModelProps = z.output<
  typeof expandedMetalModelPropsSchema
>
export type ExpandedMetalModelDefinition = z.output<
  typeof expandedMetalModelDefinitionSchema
>
/** Flat expanded-metal visual sheet with staggered diamond apertures and perimeter frame; XY, bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getExpandedMetalDimensions(
  input: ExpandedMetalModelPropsInput = {},
) {
  return expandedMetalModelPropsSchema.parse(input)
}
