import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEnclosureLidModelString } from "./parse-model-string"
import { enclosureLidModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "enclosurelid",
  schema: enclosureLidModelDefinitionSchema,
  parse: parseEnclosureLidModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
