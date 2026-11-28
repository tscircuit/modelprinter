import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCheeseHeadScrewModelString } from "./parse-model-string"
import { cheeseHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cheeseheadscrew",
  schema: cheeseHeadScrewModelDefinitionSchema,
  parse: parseCheeseHeadScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
