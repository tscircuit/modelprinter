import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirReliefValveModelParams } from "./parse-model-string"
import { airReliefValveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airreliefvalve",
  schema: airReliefValveModelDefinitionSchema,
  parse: parseAirReliefValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
