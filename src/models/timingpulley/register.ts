import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTimingPulleyModelString } from "./parse-model-string"
import { timingPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "timingpulley",
  schema: timingPulleyModelDefinitionSchema,
  parse: parseTimingPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
