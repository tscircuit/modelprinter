import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirRegulatorModelParams } from "./parse-model-string"
import { airRegulatorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airregulator",
  schema: airRegulatorModelDefinitionSchema,
  parse: parseAirRegulatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
