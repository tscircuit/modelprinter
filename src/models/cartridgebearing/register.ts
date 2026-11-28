import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCartridgeBearingModelString } from "./parse-model-string"
import { cartridgeBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cartridgebearing",
  schema: cartridgeBearingModelDefinitionSchema,
  parse: parseCartridgeBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
