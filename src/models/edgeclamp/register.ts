import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEdgeClampModelString } from "./parse-model-string"
import { edgeClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "edgeclamp",
  schema: edgeClampModelDefinitionSchema,
  parse: parseEdgeClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
