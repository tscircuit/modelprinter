import { defineModel, type ModelRegistry } from "../../model-registry"
import { timingBeltModelDefinitionSchema } from "./schema"
import { parseTimingBeltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "timingbelt",
  schema: timingBeltModelDefinitionSchema,
  parse: parseTimingBeltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
