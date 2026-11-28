import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlowBoltModelString } from "./parse-model-string"
import { plowBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "plowbolt",
  schema: plowBoltModelDefinitionSchema,
  parse: parsePlowBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
