import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHoseBarbModelParams } from "./parse-model-string"
import { hoseBarbModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "hosebarb",
  schema: hoseBarbModelDefinitionSchema,
  parse: parseHoseBarbModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
