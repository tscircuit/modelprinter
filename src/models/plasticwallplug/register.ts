import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlasticWallPlugModelString } from "./parse-model-string"
import { plasticWallPlugModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "plasticwallplug",
  schema: plasticWallPlugModelDefinitionSchema,
  parse: parsePlasticWallPlugModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
