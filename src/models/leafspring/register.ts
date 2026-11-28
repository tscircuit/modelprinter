import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeafSpringModelString } from "./parse-model-string"
import { leafSpringModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "leafspring",
  schema: leafSpringModelDefinitionSchema,
  parse: parseLeafSpringModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
