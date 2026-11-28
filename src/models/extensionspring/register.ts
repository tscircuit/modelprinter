import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseExtensionSpringModelParams } from "./parse-model-string"
import { extensionSpringModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "extensionspring",
  schema: extensionSpringModelDefinitionSchema,
  parse: parseExtensionSpringModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
