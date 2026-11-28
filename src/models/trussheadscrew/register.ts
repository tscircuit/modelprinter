import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTrussHeadScrewModelString } from "./parse-model-string"
import { trussHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "trussheadscrew",
  schema: trussHeadScrewModelDefinitionSchema,
  parse: parseTrussHeadScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
