import { defineModel, type ModelRegistry } from "../../model-registry"
import { bridgeHandleModelDefinitionSchema } from "./schema"
import { parseBridgeHandleModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "bridgehandle",
  schema: bridgeHandleModelDefinitionSchema,
  parse: parseBridgeHandleModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
