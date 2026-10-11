import { defineModel, type ModelRegistry } from "../../model-registry"
import { hollowShaftModelDefinitionSchema } from "./schema"
import { parseHollowShaftModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "hollowshaft",
  schema: hollowShaftModelDefinitionSchema,
  parse: parseHollowShaftModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
