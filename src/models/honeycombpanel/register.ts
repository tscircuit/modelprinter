import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHoneycombPanelModelString } from "./parse-model-string"
import { honeycombPanelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "honeycombpanel",
  schema: honeycombPanelModelDefinitionSchema,
  parse: parseHoneycombPanelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
