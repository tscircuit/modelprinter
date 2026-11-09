import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplitBushingModelParams } from "./parse-model-string"
import { splitBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splitbushing",
  schema: splitBushingModelDefinitionSchema,
  parse: parseSplitBushingModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
