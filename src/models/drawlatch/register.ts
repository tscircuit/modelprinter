import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDrawLatchModelString } from "./parse-model-string"
import { drawLatchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "drawlatch",
  schema: drawLatchModelDefinitionSchema,
  parse: parseDrawLatchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
