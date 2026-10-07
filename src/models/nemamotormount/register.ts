import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseNemaMotorMountModelParams } from "./parse-model-string"
import { nemaMotorMountModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "nemamotormount",
  schema: nemaMotorMountModelDefinitionSchema,
  parse: parseNemaMotorMountModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
