import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSleeveAnchorModelString } from "./parse-model-string"
import { sleeveAnchorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "sleeveanchor",
  schema: sleeveAnchorModelDefinitionSchema,
  parse: parseSleeveAnchorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
