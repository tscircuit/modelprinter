import { defineModel, type ModelRegistry } from "../../model-registry"
import { beltIdlerModelDefinitionSchema } from "./schema"
import { parseBeltIdlerModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "beltidler",
  schema: beltIdlerModelDefinitionSchema,
  parse: parseBeltIdlerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
