import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  tubeOuterDiameter: positiveLength,
  length: positiveLength.optional(),
  width: positiveLength.optional(),
  height: positiveLength.optional(),
  thread: pneumaticThread,
  shape: z.enum(["elbow", "straight"]).default("elbow"),
  metering: z.enum(["meterin", "meterout"]).default("meterout"),
}

const propsSchema = z.object(shape).strict()

export const airFlowControlValveModelPropsSchema = propsSchema
export const airFlowControlValveModelDefinitionSchema = propsSchema.extend({
  fn: z.literal("airflowcontrolvalve"),
})
export type AirFlowControlValveModelPropsInput = z.input<
  typeof airFlowControlValveModelPropsSchema
>
export type AirFlowControlValveModelProps = z.output<
  typeof airFlowControlValveModelPropsSchema
>
export type AirFlowControlValveModelDefinition = z.output<
  typeof airFlowControlValveModelDefinitionSchema
>
