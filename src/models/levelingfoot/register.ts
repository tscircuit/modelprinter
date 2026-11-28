import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLevelingFootModelString } from "./parse-model-string"
import { levelingFootModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "levelingfoot",
  schema: levelingFootModelDefinitionSchema,
  parse: parseLevelingFootModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
