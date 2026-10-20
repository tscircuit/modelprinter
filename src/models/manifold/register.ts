import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseManifoldModelParams } from "./parse-model-string"
import { manifoldModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "manifold",
  schema: manifoldModelDefinitionSchema,
  parse: parseManifoldModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
