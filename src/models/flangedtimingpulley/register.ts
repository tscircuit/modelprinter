import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangedTimingPulleyModelString } from "./parse-model-string"
import { flangedTimingPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangedtimingpulley",
  schema: flangedTimingPulleyModelDefinitionSchema,
  parse: parseFlangedTimingPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
