import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePillowBlockModelString } from "./parse-model-string"
import { pillowBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pillowblock",
  schema: pillowBlockModelDefinitionSchema,
  parse: parsePillowBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
