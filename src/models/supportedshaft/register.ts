import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSupportedShaftModelString } from "./parse-model-string"
import { supportedShaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "supportedshaft",
  schema: supportedShaftModelDefinitionSchema,
  parse: parseSupportedShaftModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
