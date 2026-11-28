import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSanitaryClampFerruleModelString } from "./parse-model-string"
import { sanitaryClampFerruleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "sanitaryclampferrule",
  schema: sanitaryClampFerruleModelDefinitionSchema,
  parse: parseSanitaryClampFerruleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
