import { defineModel, type ModelRegistry } from "../../model-registry"
import { flangeboltModelDefinitionSchema } from "./schema"
import { parseFlangeBoltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flangebolt",
  schema: flangeboltModelDefinitionSchema,
  parse: parseFlangeBoltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
