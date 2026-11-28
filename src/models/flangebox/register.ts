import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangeBoxModelString } from "./parse-model-string"
import { flangeBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangebox",
  schema: flangeBoxModelDefinitionSchema,
  parse: parseFlangeBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
