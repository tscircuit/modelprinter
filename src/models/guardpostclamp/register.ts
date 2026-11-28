import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGuardPostClampModelString } from "./parse-model-string"
import { guardPostClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "guardpostclamp",
  schema: guardPostClampModelDefinitionSchema,
  parse: parseGuardPostClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
