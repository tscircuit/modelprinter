import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundedBoxModelParams } from "./parse-model-string"
import { roundedBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundedbox",
  schema: roundedBoxModelDefinitionSchema,
  parse: parseRoundedBoxModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
