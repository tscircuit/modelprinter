import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCartridgeFuseModelString } from "./parse-model-string"
import { cartridgeFuseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cartridgefuse",
  schema: cartridgeFuseModelDefinitionSchema,
  parse: parseCartridgeFuseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
