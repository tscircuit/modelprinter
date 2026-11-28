import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHitchPinModelString } from "./parse-model-string"
import { hitchPinModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hitchpin",
  schema: hitchPinModelDefinitionSchema,
  parse: parseHitchPinModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
