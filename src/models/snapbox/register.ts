import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSnapBoxModelString } from "./parse-model-string"
import { snapBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "snapbox",
  schema: snapBoxModelDefinitionSchema,
  parse: parseSnapBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
