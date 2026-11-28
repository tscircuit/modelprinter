import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseXRingModelString } from "./parse-model-string"
import { xRingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "xring",
  schema: xRingModelDefinitionSchema,
  parse: parseXRingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
