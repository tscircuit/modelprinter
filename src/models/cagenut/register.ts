import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCageNutModelString } from "./parse-model-string"
import { cageNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cagenut",
  schema: cageNutModelDefinitionSchema,
  parse: parseCageNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
