import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseProngedTNutModelString } from "./parse-model-string"
import { prongedTNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "prongedtnut",
  schema: prongedTNutModelDefinitionSchema,
  parse: parseProngedTNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
