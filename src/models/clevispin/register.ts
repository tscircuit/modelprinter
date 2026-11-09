import { defineModel, type ModelRegistry } from "../../model-registry"
import { clevisPinModelDefinitionSchema } from "./schema"
import { parseClevisPinModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "clevispin",
  schema: clevisPinModelDefinitionSchema,
  parse: parseClevisPinModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
