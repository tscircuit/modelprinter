import { z } from "zod"
import {
  positiveLength,
  pneumaticAngle,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  shaftDiameter: positiveLength,
  shaftLength: positiveLength,
  travel: pneumaticAngle,
  angle: pneumaticAngle.default(0),
  portThread: pneumaticThread.optional(),
  mechanism: z.enum(["rackandpinion", "vane"]).default("rackandpinion"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (
    !(p.travel > 0 && p.travel <= 360 && p.angle >= 0 && p.angle <= p.travel)
  ) {
    context.addIssue({
      code: "custom",
      message: "Angle must lie within a positive travel of at most 360 degrees",
    })
  }
  if (!(p.shaftDiameter < Math.min(p.length, p.width))) {
    context.addIssue({
      code: "custom",
      message: "Shaft diameter must fit the body",
    })
  }
}

export const rotaryAirActuatorModelPropsSchema =
  propsSchema.superRefine(validate)
export const rotaryAirActuatorModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("rotaryairactuator") })
  .superRefine(validate)
export type RotaryAirActuatorModelPropsInput = z.input<
  typeof rotaryAirActuatorModelPropsSchema
>
export type RotaryAirActuatorModelProps = z.output<
  typeof rotaryAirActuatorModelPropsSchema
>
export type RotaryAirActuatorModelDefinition = z.output<
  typeof rotaryAirActuatorModelDefinitionSchema
>
