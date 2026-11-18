import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePushFittingModelParams } from "./parse-model-string"
import { pushFittingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pushfitting",
  schema: pushFittingModelDefinitionSchema,
  parse: parsePushFittingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
