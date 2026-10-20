import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseReducingBushingModelParams } from "./parse-model-string"
import { reducingBushingModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "reducingbushing",
  schema: reducingBushingModelDefinitionSchema,
  parse: parseReducingBushingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
