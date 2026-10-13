import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeTeeModelParams } from "./parse-model-string"
import { pipeTeeModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipetee",
  schema: pipeTeeModelDefinitionSchema,
  parse: parsePipeTeeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
