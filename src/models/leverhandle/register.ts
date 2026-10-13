import { defineModel, type ModelRegistry } from "../../model-registry"
import { leverHandleModelDefinitionSchema } from "./schema"
import { parseLeverHandleModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "leverhandle",
  schema: leverHandleModelDefinitionSchema,
  parse: parseLeverHandleModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
