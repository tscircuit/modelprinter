import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirTubingModelParams } from "./parse-model-string"
import { airTubingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airtubing",
  schema: airTubingModelDefinitionSchema,
  parse: parseAirTubingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
