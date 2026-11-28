import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWireSpliceModelString } from "./parse-model-string"
import { wireSpliceModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wiresplice",
  schema: wireSpliceModelDefinitionSchema,
  parse: parseWireSpliceModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
