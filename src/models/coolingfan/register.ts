import { defineModel, type ModelRegistry } from "../../model-registry"
import { coolingFanModelDefinitionSchema } from "./schema"
import { parseCoolingFanModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "coolingfan",
  schema: coolingFanModelDefinitionSchema,
  parse: parseCoolingFanModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
