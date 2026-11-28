import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAxialFanModelString } from "./parse-model-string"
import { axialFanModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "axialfan",
  schema: axialFanModelDefinitionSchema,
  parse: parseAxialFanModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
