import { defineModel, type ModelRegistry } from "../../model-registry"
import { toggleClampModelDefinitionSchema } from "./schema"
import { parseToggleClampModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "toggleclamp",
  schema: toggleClampModelDefinitionSchema,
  parse: parseToggleClampModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
