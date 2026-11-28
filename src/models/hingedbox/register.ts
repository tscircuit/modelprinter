import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHingedBoxModelString } from "./parse-model-string"
import { hingedBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hingedbox",
  schema: hingedBoxModelDefinitionSchema,
  parse: parseHingedBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
