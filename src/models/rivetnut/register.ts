import { defineModel, type ModelRegistry } from "../../model-registry"
import { rivetNutModelDefinitionSchema } from "./schema"
import { parseRivetNutModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rivetnut",
  schema: rivetNutModelDefinitionSchema,
  parse: parseRivetNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
