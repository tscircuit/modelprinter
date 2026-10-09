import { defineModel, type ModelRegistry } from "../../model-registry"
import { heatSetInsertModelDefinitionSchema } from "./schema"
import { parseHeatSetInsertModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "heatsetinsert",
  schema: heatSetInsertModelDefinitionSchema,
  parse: parseHeatSetInsertModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
