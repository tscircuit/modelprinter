import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCompressionFittingModelParams } from "./parse-model-string"
import { compressionFittingModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "compressionfitting",
  schema: compressionFittingModelDefinitionSchema,
  parse: parseCompressionFittingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
