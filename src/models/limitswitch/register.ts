import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLimitSwitchModelString } from "./parse-model-string"
import { limitSwitchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "limitswitch",
  schema: limitSwitchModelDefinitionSchema,
  parse: parseLimitSwitchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
