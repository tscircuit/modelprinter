import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHeatSpreaderModelString } from "./parse-model-string"
import { heatSpreaderModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "heatspreader",
  schema: heatSpreaderModelDefinitionSchema,
  parse: parseHeatSpreaderModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
