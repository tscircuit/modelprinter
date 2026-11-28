import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpringPlungerModelString } from "./parse-model-string"
import { springPlungerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "springplunger",
  schema: springPlungerModelDefinitionSchema,
  parse: parseSpringPlungerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
