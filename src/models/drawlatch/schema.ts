import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  length: positiveLength.default(100),
  width: positiveLength.default(25),
  baseThickness: positiveLength.default(4),
  handleHeight: positiveLength.default(18),
  wireDiameter: positiveLength.default(4),
  holeDiameter: positiveLength.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.length > 3 * p.width))
    context.addIssue({
      code: "custom",
      message: "Invalid drawlatch dimensions: length > 3*width",
    })
  if (!(p.width > 4 * p.wireDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid drawlatch dimensions: width > 4*wireDiameter",
    })
  if (!(p.handleHeight > 2 * p.wireDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid drawlatch dimensions: handleHeight > 2*wireDiameter",
    })
  if (!(p.baseThickness < p.handleHeight / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid drawlatch dimensions: baseThickness < handleHeight/2",
    })
  if (!(p.holeDiameter < p.width / 4))
    context.addIssue({
      code: "custom",
      message: "Invalid drawlatch dimensions: holeDiameter < width/4",
    })
}
export const drawLatchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const drawLatchModelDefinitionSchema = z
  .object({ fn: z.literal("drawlatch"), ...shape })
  .strict()
  .superRefine(validate)
export type DrawLatchModelPropsInput = z.input<typeof drawLatchModelPropsSchema>
export type DrawLatchModelProps = z.output<typeof drawLatchModelPropsSchema>
export type DrawLatchModelDefinition = z.output<
  typeof drawLatchModelDefinitionSchema
>
/** Nominal closed draw latch with base, handle, wire bail and keeper; long axis X. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getDrawLatchDimensions(input: DrawLatchModelPropsInput = {}) {
  return drawLatchModelPropsSchema.parse(input)
}
