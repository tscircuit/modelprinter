import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBarrelJackModelString } from "./parse-model-string"
import { barrelJackModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "barreljack",
  schema: barrelJackModelDefinitionSchema,
  parse: parseBarrelJackModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
