import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength.optional(),
  height: positiveLength.optional(),
  tubeOuterDiameter: positiveLength,
  exhaustThread: pneumaticThread.optional(),
  shape: z.enum(["inline", "block"]).default("inline"),
  venturi: z.boolean().default(false),
}

const propsSchema = z.object(shape).strict()

export const vacuumGeneratorModelPropsSchema = propsSchema
export const vacuumGeneratorModelDefinitionSchema = propsSchema.extend({
  fn: z.literal("vacuumgenerator"),
})
export type VacuumGeneratorModelPropsInput = z.input<
  typeof vacuumGeneratorModelPropsSchema
>
export type VacuumGeneratorModelProps = z.output<
  typeof vacuumGeneratorModelPropsSchema
>
export type VacuumGeneratorModelDefinition = z.output<
  typeof vacuumGeneratorModelDefinitionSchema
>
