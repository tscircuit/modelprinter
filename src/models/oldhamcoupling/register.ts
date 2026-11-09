import { defineModel, type ModelRegistry } from "../../model-registry"
import { oldhamCouplingModelDefinitionSchema } from "./schema"
import { parseOldhamCouplingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "oldhamcoupling",
  schema: oldhamCouplingModelDefinitionSchema,
  parse: parseOldhamCouplingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
