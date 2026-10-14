import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseStockPlateModelParams } from "./parse-model-string"
import { stockPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "stockplate",
  schema: stockPlateModelDefinitionSchema,
  parse: parseStockPlateModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
