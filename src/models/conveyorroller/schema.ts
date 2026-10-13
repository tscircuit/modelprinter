import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(50),
  length: positiveLength.default(150),
  wallThickness: positiveLength.default(3),
  shaftDiameter: positiveLength.default(10),
  shaftExtension: positiveLength.default(15),
  endThickness: positiveLength.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.outerDiameter <= p.shaftDiameter + 2 * p.wallThickness)
    context.addIssue({
      code: "custom",
      message: "Tube wall must leave radial clearance around the axle",
    })
  if (p.length <= 2 * p.endThickness)
    context.addIssue({
      code: "custom",
      message: "End plugs must leave a positive-length hollow middle",
    })
  if (p.outerDiameter / 2 - p.wallThickness <= p.shaftDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Wall thickness must leave radial clearance around the axle",
    })
}
export const conveyorRollerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const conveyorRollerModelDefinitionSchema = z
  .object({ fn: z.literal("conveyorroller"), ...shape })
  .strict()
  .superRefine(validate)
export type ConveyorRollerModelPropsInput = z.input<
  typeof conveyorRollerModelPropsSchema
>
export type ConveyorRollerModelProps = z.output<
  typeof conveyorRollerModelPropsSchema
>
export type ConveyorRollerModelDefinition = z.output<
  typeof conveyorRollerModelDefinitionSchema
>
/** Hollow conveyor tube with end plugs and a continuous axle projecting beyond each end. Axis Z, tube spans Z=0..length and axle starts at negative shaftExtension. End plugs are nominal; internal bearings and shaft flats are not specified. All lengths are normalized to millimeters. */
export function getConveyorRollerDimensions(
  input: ConveyorRollerModelPropsInput = {},
) {
  const p = conveyorRollerModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.outerDiameter,
      p.outerDiameter,
      p.length + 2 * p.shaftExtension,
    ] as [number, number, number],
    bottomZ: -p.shaftExtension,
    topZ: p.length + p.shaftExtension,
  }
}
