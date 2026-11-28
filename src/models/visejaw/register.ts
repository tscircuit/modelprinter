import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseViseJawModelString } from "./parse-model-string"
import { viseJawModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "visejaw",
  schema: viseJawModelDefinitionSchema,
  parse: parseViseJawModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
