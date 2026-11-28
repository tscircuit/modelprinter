import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlatBeltPulleyModelString } from "./parse-model-string"
import { flatBeltPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flatbeltpulley",
  schema: flatBeltPulleyModelDefinitionSchema,
  parse: parseFlatBeltPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
