import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePanScrewModelParams } from "./parse-model-string"
import { panScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "panscrew",
  schema: panScrewModelDefinitionSchema,
  parse: parsePanScrewModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
