import { defineModel, type ModelRegistry } from "../../model-registry"
import { blindRivetModelDefinitionSchema } from "./schema"
import { parseBlindRivetModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "blindrivet",
  schema: blindRivetModelDefinitionSchema,
  parse: parseBlindRivetModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
