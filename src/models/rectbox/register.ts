import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRectBoxModelParams } from "./parse-model-string"
import { rectBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rectbox",
  schema: rectBoxModelDefinitionSchema,
  parse: parseRectBoxModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
