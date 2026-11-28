import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWireDuctModelString } from "./parse-model-string"
import { wireDuctModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wireduct",
  schema: wireDuctModelDefinitionSchema,
  parse: parseWireDuctModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
