import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundBeltModelString } from "./parse-model-string"
import { roundBeltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundbelt",
  schema: roundBeltModelDefinitionSchema,
  parse: parseRoundBeltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
