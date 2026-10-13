import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeNippleModelParams } from "./parse-model-string"
import { pipeNippleModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipenipple",
  schema: pipeNippleModelDefinitionSchema,
  parse: parsePipeNippleModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
