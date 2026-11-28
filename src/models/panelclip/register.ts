import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePanelClipModelString } from "./parse-model-string"
import { panelClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "panelclip",
  schema: panelClipModelDefinitionSchema,
  parse: parsePanelClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
