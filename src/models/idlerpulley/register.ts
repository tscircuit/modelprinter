import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseIdlerPulleyModelString } from "./parse-model-string"
import { idlerPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "idlerpulley",
  schema: idlerPulleyModelDefinitionSchema,
  parse: parseIdlerPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
