import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShaftEndSupportModelString } from "./parse-model-string"
import { shaftEndSupportModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shaftendsupport",
  schema: shaftEndSupportModelDefinitionSchema,
  parse: parseShaftEndSupportModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
