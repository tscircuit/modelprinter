import { defineModel, type ModelRegistry } from "../../model-registry"
import { helicalGearModelDefinitionSchema } from "../../helical-gear-schema"
import { parseHelicalGearModelParams } from "../../parse-helical-gear-model-string"

export const model = defineModel({
  name: "helicalgear",
  schema: helicalGearModelDefinitionSchema,
  parse: parseHelicalGearModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
