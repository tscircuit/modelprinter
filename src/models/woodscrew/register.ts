import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWoodScrewModelString } from "./parse-model-string"
import { woodScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "woodscrew",
  schema: woodScrewModelDefinitionSchema,
  parse: parseWoodScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
