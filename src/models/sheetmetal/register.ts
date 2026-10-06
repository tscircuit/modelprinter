import { defineModel, type ModelRegistry } from "../../model-registry"
import { sheetMetalModelDefinitionSchema } from "../../sheet-metal-schema"
import { parseSheetMetalModelParams } from "../../parse-sheet-metal-model-string"

export const model = defineModel({
  name: "sheetmetal",
  schema: sheetMetalModelDefinitionSchema,
  parse: parseSheetMetalModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
