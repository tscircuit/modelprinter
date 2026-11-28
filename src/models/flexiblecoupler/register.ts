import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlexibleCouplerModelParams } from "./parse-model-string"
import { flexibleCouplerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flexiblecoupler",
  schema: flexibleCouplerModelDefinitionSchema,
  parse: parseFlexibleCouplerModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
