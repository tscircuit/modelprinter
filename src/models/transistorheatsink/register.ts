import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTransistorHeatsinkModelString } from "./parse-model-string"
import { transistorHeatsinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "transistorheatsink",
  schema: transistorHeatsinkModelDefinitionSchema,
  parse: parseTransistorHeatsinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
