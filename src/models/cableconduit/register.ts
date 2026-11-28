import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCableConduitModelString } from "./parse-model-string"
import { cableConduitModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cableconduit",
  schema: cableConduitModelDefinitionSchema,
  parse: parseCableConduitModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
