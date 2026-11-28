import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSuctionStrainerModelString } from "./parse-model-string"
import { suctionStrainerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "suctionstrainer",
  schema: suctionStrainerModelDefinitionSchema,
  parse: parseSuctionStrainerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
