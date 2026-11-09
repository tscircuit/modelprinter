import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeCapModelParams } from "./parse-model-string"
import { pipeCapModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipecap",
  schema: pipeCapModelDefinitionSchema,
  parse: parsePipeCapModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
