import { defineModel, type ModelRegistry } from "../../model-registry"
import { wireDuctModelDefinitionSchema } from "./schema"
import { parseWireDuctModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "wireduct",
  schema: wireDuctModelDefinitionSchema,
  parse: parseWireDuctModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
