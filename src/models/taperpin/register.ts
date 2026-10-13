import { defineModel, type ModelRegistry } from "../../model-registry"
import { taperPinModelDefinitionSchema } from "./schema"
import { parseTaperPinModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "taperpin",
  schema: taperPinModelDefinitionSchema,
  parse: parseTaperPinModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
