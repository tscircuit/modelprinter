import { defineModel, type ModelRegistry } from "../../model-registry"
import { shaftSupportModelDefinitionSchema } from "./schema"
import { parseShaftSupportModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "shaftsupport",
  schema: shaftSupportModelDefinitionSchema,
  parse: parseShaftSupportModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
