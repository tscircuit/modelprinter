import { defineModel, type ModelRegistry } from "../../model-registry"
import { jawCouplingModelDefinitionSchema } from "./schema"
import { parseJawCouplingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "jawcoupling",
  schema: jawCouplingModelDefinitionSchema,
  parse: parseJawCouplingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
