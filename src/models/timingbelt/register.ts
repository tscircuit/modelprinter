import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTimingBeltModelString } from "./parse-model-string"
import { timingBeltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "timingbelt",
  schema: timingBeltModelDefinitionSchema,
  parse: parseTimingBeltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
