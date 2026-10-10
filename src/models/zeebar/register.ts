import { defineModel, type ModelRegistry } from "../../model-registry"
import { zeeBarModelDefinitionSchema } from "./schema"
import { parseZeeBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "zeebar",
  schema: zeeBarModelDefinitionSchema,
  parse: parseZeeBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
