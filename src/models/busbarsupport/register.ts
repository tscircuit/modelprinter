import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBusbarSupportModelString } from "./parse-model-string"
import { busbarSupportModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "busbarsupport",
  schema: busbarSupportModelDefinitionSchema,
  parse: parseBusbarSupportModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
