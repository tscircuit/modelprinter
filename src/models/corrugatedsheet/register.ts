import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCorrugatedSheetModelString } from "./parse-model-string"
import { corrugatedSheetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "corrugatedsheet",
  schema: corrugatedSheetModelDefinitionSchema,
  parse: parseCorrugatedSheetModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
