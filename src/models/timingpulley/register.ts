import { defineModel, type ModelRegistry } from "../../model-registry"
import { timingPulleyModelDefinitionSchema } from "./schema"
import { parseTimingPulleyModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "timingpulley",
  schema: timingPulleyModelDefinitionSchema,
  parse: parseTimingPulleyModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
