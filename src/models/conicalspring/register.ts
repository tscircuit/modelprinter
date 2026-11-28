import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseConicalSpringModelString } from "./parse-model-string"
import { conicalSpringModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "conicalspring",
  schema: conicalSpringModelDefinitionSchema,
  parse: parseConicalSpringModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
