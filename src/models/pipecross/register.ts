import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeCrossModelParams } from "./parse-model-string"
import { pipeCrossModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipecross",
  schema: pipeCrossModelDefinitionSchema,
  parse: parsePipeCrossModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
