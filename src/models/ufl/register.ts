import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseUflModelParams } from "./parse-model-string"
import { uflModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ufl",
  schema: uflModelDefinitionSchema,
  parse: parseUflModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
