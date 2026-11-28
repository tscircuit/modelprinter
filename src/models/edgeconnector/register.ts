import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEdgeConnectorModelString } from "./parse-model-string"
import { edgeConnectorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "edgeconnector",
  schema: edgeConnectorModelDefinitionSchema,
  parse: parseEdgeConnectorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
