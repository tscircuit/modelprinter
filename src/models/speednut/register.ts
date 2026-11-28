import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpeedNutModelString } from "./parse-model-string"
import { speedNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "speednut",
  schema: speedNutModelDefinitionSchema,
  parse: parseSpeedNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
