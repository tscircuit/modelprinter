import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseToeClampModelString } from "./parse-model-string"
import { toeClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "toeclamp",
  schema: toeClampModelDefinitionSchema,
  parse: parseToeClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
