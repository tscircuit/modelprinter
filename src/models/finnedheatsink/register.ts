import { defineModel, type ModelRegistry } from "../../model-registry"
import { finnedHeatsinkModelDefinitionSchema } from "./schema"
import { parseFinnedHeatsinkModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "finnedheatsink",
  schema: finnedHeatsinkModelDefinitionSchema,
  parse: parseFinnedHeatsinkModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
