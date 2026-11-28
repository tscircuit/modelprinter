import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSexBoltModelString } from "./parse-model-string"
import { sexBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "sexbolt",
  schema: sexBoltModelDefinitionSchema,
  parse: parseSexBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
