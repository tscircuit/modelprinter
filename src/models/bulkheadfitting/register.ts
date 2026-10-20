import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBulkheadFittingModelParams } from "./parse-model-string"
import { bulkheadFittingModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "bulkheadfitting",
  schema: bulkheadFittingModelDefinitionSchema,
  parse: parseBulkheadFittingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
