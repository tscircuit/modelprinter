import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSheetMetalScrewModelString } from "./parse-model-string"
import { sheetMetalScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "sheetmetalscrew",
  schema: sheetMetalScrewModelDefinitionSchema,
  parse: parseSheetMetalScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
