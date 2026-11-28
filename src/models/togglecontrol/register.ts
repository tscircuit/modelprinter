import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseToggleControlModelString } from "./parse-model-string"
import { toggleControlModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "togglecontrol",
  schema: toggleControlModelDefinitionSchema,
  parse: parseToggleControlModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
