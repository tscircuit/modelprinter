import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWedgeAnchorModelString } from "./parse-model-string"
import { wedgeAnchorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wedgeanchor",
  schema: wedgeAnchorModelDefinitionSchema,
  parse: parseWedgeAnchorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
