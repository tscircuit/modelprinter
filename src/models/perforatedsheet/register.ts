import { defineModel, type ModelRegistry } from "../../model-registry"
import { perforatedSheetModelDefinitionSchema } from "./schema"
import { parsePerforatedSheetModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "perforatedsheet",
  schema: perforatedSheetModelDefinitionSchema,
  parse: parsePerforatedSheetModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
