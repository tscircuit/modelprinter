import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShaftModelParams } from "./parse-model-string"
import { shaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shaft",
  schema: shaftModelDefinitionSchema,
  parse: parseShaftModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
