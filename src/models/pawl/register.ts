import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePawlModelString } from "./parse-model-string"
import { pawlModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pawl",
  schema: pawlModelDefinitionSchema,
  parse: parsePawlModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
