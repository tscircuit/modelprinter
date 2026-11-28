import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHeatsinkClipModelString } from "./parse-model-string"
import { heatsinkClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "heatsinkclip",
  schema: heatsinkClipModelDefinitionSchema,
  parse: parseHeatsinkClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
