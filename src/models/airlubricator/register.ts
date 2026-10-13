import { defineModel, type ModelRegistry } from "../../model-registry"
import { airLubricatorModelDefinitionSchema } from "./schema"
import { parseAirLubricatorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "airlubricator",
  schema: airLubricatorModelDefinitionSchema,
  parse: parseAirLubricatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
