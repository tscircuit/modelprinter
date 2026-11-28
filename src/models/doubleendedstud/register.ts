import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDoubleEndedStudModelString } from "./parse-model-string"
import { doubleEndedStudModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "doubleendedstud",
  schema: doubleEndedStudModelDefinitionSchema,
  parse: parseDoubleEndedStudModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
