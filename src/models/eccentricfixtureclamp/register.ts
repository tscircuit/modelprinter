import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEccentricFixtureClampModelString } from "./parse-model-string"
import { eccentricFixtureClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "eccentricfixtureclamp",
  schema: eccentricFixtureClampModelDefinitionSchema,
  parse: parseEccentricFixtureClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
