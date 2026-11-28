import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFanFilterModelString } from "./parse-model-string"
import { fanFilterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fanfilter",
  schema: fanFilterModelDefinitionSchema,
  parse: parseFanFilterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
