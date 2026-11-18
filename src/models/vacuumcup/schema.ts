import { z } from "zod"
import {
  positiveLength,
  pneumaticCount,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  outerDiameter: positiveLength,
  height: positiveLength,
  bellows: pneumaticCount.optional(),
  thread: pneumaticThread,
}

const propsSchema = z.object(shape).strict()

export const vacuumCupModelPropsSchema = propsSchema
export const vacuumCupModelDefinitionSchema = propsSchema.extend({
  fn: z.literal("vacuumcup"),
})
export type VacuumCupModelPropsInput = z.input<typeof vacuumCupModelPropsSchema>
export type VacuumCupModelProps = z.output<typeof vacuumCupModelPropsSchema>
export type VacuumCupModelDefinition = z.output<
  typeof vacuumCupModelDefinitionSchema
>
