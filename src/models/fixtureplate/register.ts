import { defineModel, type ModelRegistry } from "../../model-registry"
import { fixturePlateModelDefinitionSchema } from "./schema"
import { parseFixturePlateModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "fixtureplate",
  schema: fixturePlateModelDefinitionSchema,
  parse: parseFixturePlateModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
