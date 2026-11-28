import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundBeltPulleyModelString } from "./parse-model-string"
import { roundBeltPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundbeltpulley",
  schema: roundBeltPulleyModelDefinitionSchema,
  parse: parseRoundBeltPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
