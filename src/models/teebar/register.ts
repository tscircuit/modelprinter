import { defineModel, type ModelRegistry } from "../../model-registry"
import { teeBarModelDefinitionSchema } from "./schema"
import { parseTeeBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "teebar",
  schema: teeBarModelDefinitionSchema,
  parse: parseTeeBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
