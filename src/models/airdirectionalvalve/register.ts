import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirDirectionalValveModelParams } from "./parse-model-string"
import { airDirectionalValveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airdirectionalvalve",
  schema: airDirectionalValveModelDefinitionSchema,
  parse: parseAirDirectionalValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
