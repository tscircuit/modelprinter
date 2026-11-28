import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCapNutModelString } from "./parse-model-string"
import { capNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "capnut",
  schema: capNutModelDefinitionSchema,
  parse: parseCapNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
