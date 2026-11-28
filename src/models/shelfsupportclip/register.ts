import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShelfSupportClipModelString } from "./parse-model-string"
import { shelfSupportClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shelfsupportclip",
  schema: shelfSupportClipModelDefinitionSchema,
  parse: parseShelfSupportClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
