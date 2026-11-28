import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCouplingNutModelString } from "./parse-model-string"
import { couplingNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "couplingnut",
  schema: couplingNutModelDefinitionSchema,
  parse: parseCouplingNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
