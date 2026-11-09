import { defineModel, type ModelRegistry } from "../../model-registry"
import { expandedMetalModelDefinitionSchema } from "./schema"
import { parseExpandedMetalModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "expandedmetal",
  schema: expandedMetalModelDefinitionSchema,
  parse: parseExpandedMetalModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
