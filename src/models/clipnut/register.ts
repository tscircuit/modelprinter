import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClipNutModelString } from "./parse-model-string"
import { clipNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clipnut",
  schema: clipNutModelDefinitionSchema,
  parse: parseClipNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
