import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBridgeHandleModelString } from "./parse-model-string"
import { bridgeHandleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bridgehandle",
  schema: bridgeHandleModelDefinitionSchema,
  parse: parseBridgeHandleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
