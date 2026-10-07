import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearRailModelParams } from "./parse-model-string"
import { linearRailModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "linearrail",
  schema: linearRailModelDefinitionSchema,
  parse: parseLinearRailModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
