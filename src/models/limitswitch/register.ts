import { defineModel, type ModelRegistry } from "../../model-registry"
import { limitSwitchModelDefinitionSchema } from "./schema"
import { parseLimitSwitchModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "limitswitch",
  schema: limitSwitchModelDefinitionSchema,
  parse: parseLimitSwitchModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
