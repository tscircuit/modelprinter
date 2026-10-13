import { defineModel, type ModelRegistry } from "../../model-registry"
import { retainingRingModelDefinitionSchema } from "./schema"
import { parseRetainingRingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "retainingring",
  schema: retainingRingModelDefinitionSchema,
  parse: parseRetainingRingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
