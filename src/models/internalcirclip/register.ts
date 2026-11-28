import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseInternalCirclipModelString } from "./parse-model-string"
import { internalCirclipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "internalcirclip",
  schema: internalCirclipModelDefinitionSchema,
  parse: parseInternalCirclipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
