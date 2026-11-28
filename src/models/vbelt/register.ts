import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVBeltModelString } from "./parse-model-string"
import { vBeltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vbelt",
  schema: vBeltModelDefinitionSchema,
  parse: parseVBeltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
