import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseControlRelayModelString } from "./parse-model-string"
import { controlRelayModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "controlrelay",
  schema: controlRelayModelDefinitionSchema,
  parse: parseControlRelayModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
