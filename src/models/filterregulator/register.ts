import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFilterRegulatorModelString } from "./parse-model-string"
import { filterRegulatorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "filterregulator",
  schema: filterRegulatorModelDefinitionSchema,
  parse: parseFilterRegulatorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
