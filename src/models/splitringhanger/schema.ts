import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  pipeDiameter: positiveLength.default(32),
  bandThickness: positiveLength.default(3),
  bandWidth: positiveLength.default(15),
  gap: positiveLength.default(2),
  lugWidth: positiveLength.default(14),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.bandThickness < p.pipeDiameter / 4))
    context.addIssue({
      code: "custom",
      message:
        "Invalid splitringhanger dimensions: bandThickness < pipeDiameter/4",
    })
  if (!(p.gap < p.bandThickness))
    context.addIssue({
      code: "custom",
      message: "Invalid splitringhanger dimensions: gap < bandThickness",
    })
  if (!(p.lugWidth > 2 * p.holeDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid splitringhanger dimensions: lugWidth > 2*holeDiameter",
    })
  if (!(p.bandWidth > 2 * p.holeDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid splitringhanger dimensions: bandWidth > 2*holeDiameter",
    })
}
export const splitRingHangerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const splitRingHangerModelDefinitionSchema = z
  .object({ fn: z.literal("splitringhanger"), ...shape })
  .strict()
  .superRefine(validate)
export type SplitRingHangerModelPropsInput = z.input<
  typeof splitRingHangerModelPropsSchema
>
export type SplitRingHangerModelProps = z.output<
  typeof splitRingHangerModelPropsSchema
>
export type SplitRingHangerModelDefinition = z.output<
  typeof splitRingHangerModelDefinitionSchema
>
/** Nominal two-piece pipe hanger: pipe axis Y, horizontal split, lug bolt holes and top mounting boss. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getSplitRingHangerDimensions(
  input: SplitRingHangerModelPropsInput = {},
) {
  return splitRingHangerModelPropsSchema.parse(input)
}
