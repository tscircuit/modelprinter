import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMasterChainLinkModelString } from "./parse-model-string"
import { masterChainLinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "masterchainlink",
  schema: masterChainLinkModelDefinitionSchema,
  parse: parseMasterChainLinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
