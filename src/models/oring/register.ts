import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseORingModelString } from "./parse-model-string"
import { oRingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "oring",
  schema: oRingModelDefinitionSchema,
  parse: parseORingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
