import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlatBeltModelString } from "./parse-model-string"
import { flatBeltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flatbelt",
  schema: flatBeltModelDefinitionSchema,
  parse: parseFlatBeltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
