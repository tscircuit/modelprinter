import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeCouplingModelParams } from "./parse-model-string"
import { pipeCouplingModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipecoupling",
  schema: pipeCouplingModelDefinitionSchema,
  parse: parsePipeCouplingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
