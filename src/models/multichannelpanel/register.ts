import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMultiChannelPanelModelString } from "./parse-model-string"
import { multiChannelPanelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "multichannelpanel",
  schema: multiChannelPanelModelDefinitionSchema,
  parse: parseMultiChannelPanelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
