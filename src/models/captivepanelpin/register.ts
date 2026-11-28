import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCaptivePanelPinModelString } from "./parse-model-string"
import { captivePanelPinModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "captivepanelpin",
  schema: captivePanelPinModelDefinitionSchema,
  parse: parseCaptivePanelPinModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
