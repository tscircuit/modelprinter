import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThumbScrewModelString } from "./parse-model-string"
import { thumbScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "thumbscrew",
  schema: thumbScrewModelDefinitionSchema,
  parse: parseThumbScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
