import { defineModel, type ModelRegistry } from "../../model-registry"
import { capNutModelDefinitionSchema } from "./schema"
import { parseCapNutModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "capnut",
  schema: capNutModelDefinitionSchema,
  parse: parseCapNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
