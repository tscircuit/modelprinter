import { defineModel, type ModelRegistry } from "../../model-registry"
import { airRegulatorModelDefinitionSchema } from "./schema"
import { parseAirRegulatorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "airregulator",
  schema: airRegulatorModelDefinitionSchema,
  parse: parseAirRegulatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
