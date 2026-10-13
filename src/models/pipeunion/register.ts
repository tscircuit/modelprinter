import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeUnionModelParams } from "./parse-model-string"
import { pipeUnionModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipeunion",
  schema: pipeUnionModelDefinitionSchema,
  parse: parsePipeUnionModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
