import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  knobDiameter: positiveLength,
  gaugeDiameter: positiveLength.optional(),
  portThread: pneumaticThread,
  gaugePortThread: pneumaticThread.optional(),
  gauge: z.boolean().default(false),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.gaugeDiameter === undefined || p.gauge)) {
    context.addIssue({
      code: "custom",
      message: "Gauge diameter requires the gauge flag",
    })
  }
}

export const airReliefValveModelPropsSchema = propsSchema.superRefine(validate)
export const airReliefValveModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airreliefvalve") })
  .superRefine(validate)
export type AirReliefValveModelPropsInput = z.input<
  typeof airReliefValveModelPropsSchema
>
export type AirReliefValveModelProps = z.output<
  typeof airReliefValveModelPropsSchema
>
export type AirReliefValveModelDefinition = z.output<
  typeof airReliefValveModelDefinitionSchema
>
