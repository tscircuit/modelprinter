import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirDrainValveModelParams } from "./parse-model-string"
import { airDrainValveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airdrainvalve",
  schema: airDrainValveModelDefinitionSchema,
  parse: parseAirDrainValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
