import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseJawCouplerSpiderModelString } from "./parse-model-string"
import { jawCouplerSpiderModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "jawcouplerspider",
  schema: jawCouplerSpiderModelDefinitionSchema,
  parse: parseJawCouplerSpiderModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
