import { defineModel, type ModelRegistry } from "../../model-registry"
import { roundBarModelDefinitionSchema } from "./schema"
import { parseRoundBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "roundbar",
  schema: roundBarModelDefinitionSchema,
  parse: parseRoundBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
