import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  wingWidth: positiveLength,
  hexAcrossFlats: positiveLength,
  thread: pneumaticThread,
  wing: z.boolean().default(false),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.wingWidth >= p.hexAcrossFlats)) {
    context.addIssue({
      code: "custom",
      message: "Wing span must cover the body",
    })
  }
}

export const airDrainValveModelPropsSchema = propsSchema.superRefine(validate)
export const airDrainValveModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airdrainvalve") })
  .superRefine(validate)
export type AirDrainValveModelPropsInput = z.input<
  typeof airDrainValveModelPropsSchema
>
export type AirDrainValveModelProps = z.output<
  typeof airDrainValveModelPropsSchema
>
export type AirDrainValveModelDefinition = z.output<
  typeof airDrainValveModelDefinitionSchema
>
