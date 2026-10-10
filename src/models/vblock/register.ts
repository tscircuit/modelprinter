import { defineModel, type ModelRegistry } from "../../model-registry"
import { vBlockModelDefinitionSchema } from "./schema"
import { parseVBlockModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "vblock",
  schema: vBlockModelDefinitionSchema,
  parse: parseVBlockModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
