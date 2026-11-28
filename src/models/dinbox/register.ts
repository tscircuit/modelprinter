import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDinBoxModelString } from "./parse-model-string"
import { dinBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dinbox",
  schema: dinBoxModelDefinitionSchema,
  parse: parseDinBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
