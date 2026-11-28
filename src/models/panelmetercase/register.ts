import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePanelMeterCaseModelString } from "./parse-model-string"
import { panelMeterCaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "panelmetercase",
  schema: panelMeterCaseModelDefinitionSchema,
  parse: parsePanelMeterCaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
