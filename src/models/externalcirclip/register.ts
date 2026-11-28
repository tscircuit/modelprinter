import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseExternalCirclipModelString } from "./parse-model-string"
import { externalCirclipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "externalcirclip",
  schema: externalCirclipModelDefinitionSchema,
  parse: parseExternalCirclipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
