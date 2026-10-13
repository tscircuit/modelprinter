import { defineModel, type ModelRegistry } from "../../model-registry"
import { airFilterModelDefinitionSchema } from "./schema"
import { parseAirFilterModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "airfilter",
  schema: airFilterModelDefinitionSchema,
  parse: parseAirFilterModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
