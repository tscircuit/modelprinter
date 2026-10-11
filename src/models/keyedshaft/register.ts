import { defineModel, type ModelRegistry } from "../../model-registry"
import { keyedShaftModelDefinitionSchema } from "./schema"
import { parseKeyedShaftModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "keyedshaft",
  schema: keyedShaftModelDefinitionSchema,
  parse: parseKeyedShaftModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
