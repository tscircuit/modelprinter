import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseJackScrewModelString } from "./parse-model-string"
import { jackScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "jackscrew",
  schema: jackScrewModelDefinitionSchema,
  parse: parseJackScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
