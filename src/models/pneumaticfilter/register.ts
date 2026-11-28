import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePneumaticFilterModelString } from "./parse-model-string"
import { pneumaticFilterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pneumaticfilter",
  schema: pneumaticFilterModelDefinitionSchema,
  parse: parsePneumaticFilterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
