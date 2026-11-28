import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHeatShrinkModelString } from "./parse-model-string"
import { heatShrinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "heatshrink",
  schema: heatShrinkModelDefinitionSchema,
  parse: parseHeatShrinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
