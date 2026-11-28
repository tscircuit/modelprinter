import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePcbHolderModelString } from "./parse-model-string"
import { pcbHolderModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pcbholder",
  schema: pcbHolderModelDefinitionSchema,
  parse: parsePcbHolderModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
