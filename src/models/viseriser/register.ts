import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseViseRiserModelString } from "./parse-model-string"
import { viseRiserModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "viseriser",
  schema: viseRiserModelDefinitionSchema,
  parse: parseViseRiserModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
