import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTelescopicSlideModelString } from "./parse-model-string"
import { telescopicSlideModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "telescopicslide",
  schema: telescopicSlideModelDefinitionSchema,
  parse: parseTelescopicSlideModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
