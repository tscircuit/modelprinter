import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCheckValveModelParams } from "./parse-model-string"
import { checkValveModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "checkvalve",
  schema: checkValveModelDefinitionSchema,
  parse: parseCheckValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
