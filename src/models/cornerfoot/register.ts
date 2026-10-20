import { defineModel, type ModelRegistry } from "../../model-registry"
import { cornerFootModelDefinitionSchema } from "./schema"
import { parseCornerFootModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cornerfoot",
  schema: cornerFootModelDefinitionSchema,
  parse: parseCornerFootModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
