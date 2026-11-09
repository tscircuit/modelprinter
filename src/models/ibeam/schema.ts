import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  width: positiveLength.default(40),
  height: positiveLength.default(60),
  webThickness: positiveLength.default(4),
  flangeThickness: positiveLength.default(6),
  length: positiveLength.default(100),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.webThickness < p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid ibeam dimensions: webThickness < width",
    })
  if (!(2 * p.flangeThickness < p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid ibeam dimensions: 2*flangeThickness < height",
    })
}
export const iBeamModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const iBeamModelDefinitionSchema = z
  .object({ fn: z.literal("ibeam"), ...shape })
  .strict()
  .superRefine(validate)
export type IBeamModelPropsInput = z.input<typeof iBeamModelPropsSchema>
export type IBeamModelProps = z.output<typeof iBeamModelPropsSchema>
export type IBeamModelDefinition = z.output<typeof iBeamModelDefinitionSchema>
/** I-section stock, centered XY cross section, length +Z from Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getIBeamDimensions(input: IBeamModelPropsInput = {}) {
  return iBeamModelPropsSchema.parse(input)
}
