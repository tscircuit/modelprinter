import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpringPinModelString } from "./parse-model-string"
import { springPinModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "springpin",
  schema: springPinModelDefinitionSchema,
  parse: parseSpringPinModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
