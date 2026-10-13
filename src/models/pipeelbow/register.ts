import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeElbowModelParams } from "./parse-model-string"
import { pipeElbowModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipeelbow",
  schema: pipeElbowModelDefinitionSchema,
  parse: parsePipeElbowModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
