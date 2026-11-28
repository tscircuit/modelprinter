import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFixtureJackModelString } from "./parse-model-string"
import { fixtureJackModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fixturejack",
  schema: fixtureJackModelDefinitionSchema,
  parse: parseFixtureJackModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
