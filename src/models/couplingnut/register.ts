import { defineModel, type ModelRegistry } from "../../model-registry"
import { couplingNutModelDefinitionSchema } from "./schema"
import { parseCouplingNutModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "couplingnut",
  schema: couplingNutModelDefinitionSchema,
  parse: parseCouplingNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
