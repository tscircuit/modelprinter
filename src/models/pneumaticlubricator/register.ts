import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePneumaticLubricatorModelString } from "./parse-model-string"
import { pneumaticLubricatorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pneumaticlubricator",
  schema: pneumaticLubricatorModelDefinitionSchema,
  parse: parsePneumaticLubricatorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
