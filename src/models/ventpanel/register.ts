import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVentPanelModelString } from "./parse-model-string"
import { ventPanelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ventpanel",
  schema: ventPanelModelDefinitionSchema,
  parse: parseVentPanelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
