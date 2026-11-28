import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFinnedHeatsinkModelString } from "./parse-model-string"
import { finnedHeatsinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "finnedheatsink",
  schema: finnedHeatsinkModelDefinitionSchema,
  parse: parseFinnedHeatsinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
