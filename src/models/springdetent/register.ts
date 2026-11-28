import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpringDetentModelString } from "./parse-model-string"
import { springDetentModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "springdetent",
  schema: springDetentModelDefinitionSchema,
  parse: parseSpringDetentModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
