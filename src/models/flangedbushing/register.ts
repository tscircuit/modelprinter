import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangedBushingModelParams } from "./parse-model-string"
import { flangedBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangedbushing",
  schema: flangedBushingModelDefinitionSchema,
  parse: parseFlangedBushingModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
