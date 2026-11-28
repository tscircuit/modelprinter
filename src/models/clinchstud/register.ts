import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClinchStudModelString } from "./parse-model-string"
import { clinchStudModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clinchstud",
  schema: clinchStudModelDefinitionSchema,
  parse: parseClinchStudModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
