import { defineModel, type ModelRegistry } from "../../model-registry"
import { rodEndModelDefinitionSchema } from "./schema"
import { parseRodEndModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rodend",
  schema: rodEndModelDefinitionSchema,
  parse: parseRodEndModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
