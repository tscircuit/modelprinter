import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseConicalSpringWasherModelString } from "./parse-model-string"
import { conicalSpringWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "conicalspringwasher",
  schema: conicalSpringWasherModelDefinitionSchema,
  parse: parseConicalSpringWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
