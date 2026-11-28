import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRelayBaseModelString } from "./parse-model-string"
import { relayBaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "relaybase",
  schema: relayBaseModelDefinitionSchema,
  parse: parseRelayBaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
