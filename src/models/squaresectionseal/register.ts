import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareSectionSealModelString } from "./parse-model-string"
import { squareSectionSealModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squaresectionseal",
  schema: squareSectionSealModelDefinitionSchema,
  parse: parseSquareSectionSealModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
