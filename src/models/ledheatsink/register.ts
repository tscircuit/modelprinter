import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLedHeatsinkModelString } from "./parse-model-string"
import { ledHeatsinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ledheatsink",
  schema: ledHeatsinkModelDefinitionSchema,
  parse: parseLedHeatsinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
