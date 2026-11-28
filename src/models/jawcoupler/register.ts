import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseJawCouplerModelString } from "./parse-model-string"
import { jawCouplerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "jawcoupler",
  schema: jawCouplerModelDefinitionSchema,
  parse: parseJawCouplerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
