import { defineModel, type ModelRegistry } from "../../model-registry"
import { pcbCornerClipModelDefinitionSchema } from "./schema"
import { parsePcbCornerClipModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pcbcornerclip",
  schema: pcbCornerClipModelDefinitionSchema,
  parse: parsePcbCornerClipModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
