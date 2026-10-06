import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCompressionSpringModelParams } from "./parse-model-string"
import { compressionSpringModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "compressionspring",
  schema: compressionSpringModelDefinitionSchema,
  parse: parseCompressionSpringModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
