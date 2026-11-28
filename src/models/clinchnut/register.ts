import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClinchNutModelString } from "./parse-model-string"
import { clinchNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clinchnut",
  schema: clinchNutModelDefinitionSchema,
  parse: parseClinchNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
