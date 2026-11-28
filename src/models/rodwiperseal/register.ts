import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRodWiperSealModelString } from "./parse-model-string"
import { rodWiperSealModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rodwiperseal",
  schema: rodWiperSealModelDefinitionSchema,
  parse: parseRodWiperSealModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
