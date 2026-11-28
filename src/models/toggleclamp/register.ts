import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseToggleClampModelString } from "./parse-model-string"
import { toggleClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "toggleclamp",
  schema: toggleClampModelDefinitionSchema,
  parse: parseToggleClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
