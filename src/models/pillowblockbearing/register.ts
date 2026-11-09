import { defineModel, type ModelRegistry } from "../../model-registry"
import { pillowBlockBearingModelDefinitionSchema } from "./schema"
import { parsePillowBlockBearingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pillowblockbearing",
  schema: pillowBlockBearingModelDefinitionSchema,
  parse: parsePillowBlockBearingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
