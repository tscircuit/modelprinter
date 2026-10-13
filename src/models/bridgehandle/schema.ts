import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  length: positiveLength.default(120),
  gripDiameter: positiveLength.default(15),
  height: positiveLength.default(40),
  mountingDiameter: positiveLength.default(24),
  mountingHeight: positiveLength.default(5),
  holeDiameter: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.length > 3 * p.mountingDiameter))
    context.addIssue({
      code: "custom",
      message: "Invalid bridgehandle dimensions: length > 3*mountingDiameter",
    })
  if (!(p.mountingDiameter > p.gripDiameter))
    context.addIssue({
      code: "custom",
      message:
        "Invalid bridgehandle dimensions: mountingDiameter > gripDiameter",
    })
  if (!(p.height > p.gripDiameter + p.mountingHeight))
    context.addIssue({
      code: "custom",
      message:
        "Invalid bridgehandle dimensions: height > gripDiameter+mountingHeight",
    })
  if (!(p.holeDiameter < p.gripDiameter / 2))
    context.addIssue({
      code: "custom",
      message: "Invalid bridgehandle dimensions: holeDiameter < gripDiameter/2",
    })
  if (!(p.mountingHeight < p.height / 3))
    context.addIssue({
      code: "custom",
      message: "Invalid bridgehandle dimensions: mountingHeight < height/3",
    })
}
export const bridgeHandleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const bridgeHandleModelDefinitionSchema = z
  .object({ fn: z.literal("bridgehandle"), ...shape })
  .strict()
  .superRefine(validate)
export type BridgeHandleModelPropsInput = z.input<
  typeof bridgeHandleModelPropsSchema
>
export type BridgeHandleModelProps = z.output<
  typeof bridgeHandleModelPropsSchema
>
export type BridgeHandleModelDefinition = z.output<
  typeof bridgeHandleModelDefinitionSchema
>
/** Bridge handle along X with two mounting feet and axial mounting holes; bottom Z=0. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getBridgeHandleDimensions(
  input: BridgeHandleModelPropsInput = {},
) {
  return bridgeHandleModelPropsSchema.parse(input)
}
