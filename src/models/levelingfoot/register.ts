import { defineModel, type ModelRegistry } from "../../model-registry"
import { levelingFootModelDefinitionSchema } from "./schema"
import { parseLevelingFootModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "levelingfoot",
  schema: levelingFootModelDefinitionSchema,
  parse: parseLevelingFootModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
