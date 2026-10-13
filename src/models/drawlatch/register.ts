import { defineModel, type ModelRegistry } from "../../model-registry"
import { drawLatchModelDefinitionSchema } from "./schema"
import { parseDrawLatchModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "drawlatch",
  schema: drawLatchModelDefinitionSchema,
  parse: parseDrawLatchModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
