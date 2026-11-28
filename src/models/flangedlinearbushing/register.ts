import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangedLinearBushingModelString } from "./parse-model-string"
import { flangedLinearBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangedlinearbushing",
  schema: flangedLinearBushingModelDefinitionSchema,
  parse: parseFlangedLinearBushingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
