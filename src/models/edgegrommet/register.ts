import { defineModel, type ModelRegistry } from "../../model-registry"
import { edgeGrommetModelDefinitionSchema } from "./schema"
import { parseEdgeGrommetModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "edgegrommet",
  schema: edgeGrommetModelDefinitionSchema,
  parse: parseEdgeGrommetModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
