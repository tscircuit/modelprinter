import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLAnchorBoltModelString } from "./parse-model-string"
import { lAnchorBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "lanchorbolt",
  schema: lAnchorBoltModelDefinitionSchema,
  parse: parseLAnchorBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
