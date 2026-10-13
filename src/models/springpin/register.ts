import { defineModel, type ModelRegistry } from "../../model-registry"
import { springPinModelDefinitionSchema } from "./schema"
import { parseSpringPinModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "springpin",
  schema: springPinModelDefinitionSchema,
  parse: parseSpringPinModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
