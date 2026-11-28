import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCircuitBreakerModelString } from "./parse-model-string"
import { circuitBreakerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "circuitbreaker",
  schema: circuitBreakerModelDefinitionSchema,
  parse: parseCircuitBreakerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
