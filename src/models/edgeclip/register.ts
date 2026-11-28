import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEdgeClipModelString } from "./parse-model-string"
import { edgeClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "edgeclip",
  schema: edgeClipModelDefinitionSchema,
  parse: parseEdgeClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
