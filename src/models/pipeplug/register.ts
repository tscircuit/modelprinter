import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipePlugModelParams } from "./parse-model-string"
import { pipePlugModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipeplug",
  schema: pipePlugModelDefinitionSchema,
  parse: parsePipePlugModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
