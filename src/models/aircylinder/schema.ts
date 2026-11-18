import { z } from "zod"
import {
  positiveLength,
  nonnegativeLength,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength.optional(),
  width: positiveLength.optional(),
  height: positiveLength.optional(),
  boreDiameter: positiveLength,
  outerDiameter: positiveLength.optional(),
  stroke: positiveLength,
  rodDiameter: positiveLength,
  retractedRodLength: nonnegativeLength,
  extension: nonnegativeLength.default(0),
  portThread: pneumaticThread,
  bodyStyle: z.enum(["round", "compact", "tierod"]).default("round"),
  action: z.enum(["singleacting", "doubleacting"]).default("doubleacting"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.length !== undefined && p.length > p.stroke)) {
    context.addIssue({
      code: "custom",
      message: "Cylinder body length must exceed stroke",
    })
  }
  if (!(p.rodDiameter < p.boreDiameter)) {
    context.addIssue({
      code: "custom",
      message: "Rod diameter must be smaller than the bore",
    })
  }
  if (
    !(p.bodyStyle === "round"
      ? p.outerDiameter !== undefined &&
        p.outerDiameter > p.boreDiameter &&
        p.width === undefined &&
        p.height === undefined
      : p.outerDiameter === undefined &&
        p.width !== undefined &&
        p.height !== undefined &&
        Math.min(p.width, p.height) > p.boreDiameter)
  ) {
    context.addIssue({
      code: "custom",
      message:
        "Supply a round OD or a block width and height that enclose the bore",
    })
  }
  if (!(p.extension <= p.stroke)) {
    context.addIssue({
      code: "custom",
      message: "Extension must be within the stroke",
    })
  }
}

export const airCylinderModelPropsSchema = propsSchema.superRefine(validate)
export const airCylinderModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("aircylinder") })
  .superRefine(validate)
export type AirCylinderModelPropsInput = z.input<
  typeof airCylinderModelPropsSchema
>
export type AirCylinderModelProps = z.output<typeof airCylinderModelPropsSchema>
export type AirCylinderModelDefinition = z.output<
  typeof airCylinderModelDefinitionSchema
>
