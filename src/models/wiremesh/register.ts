import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWireMeshModelString } from "./parse-model-string"
import { wireMeshModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wiremesh",
  schema: wireMeshModelDefinitionSchema,
  parse: parseWireMeshModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
