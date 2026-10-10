import { defineModel, type ModelRegistry } from "../../model-registry"
import { pushFitPlugModelDefinitionSchema } from "./schema"
import { parsePushFitPlugModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pushfitplug",
  schema: pushFitPlugModelDefinitionSchema,
  parse: parsePushFitPlugModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
