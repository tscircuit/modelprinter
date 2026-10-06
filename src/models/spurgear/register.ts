import { defineModel, type ModelRegistry } from "../../model-registry"
import { spurGearModelDefinitionSchema } from "../../spur-gear-schema"
import { parseSpurGearModelParams } from "../../parse-spur-gear-model-string"

export const model = defineModel({
  name: "spurgear",
  schema: spurGearModelDefinitionSchema,
  parse: parseSpurGearModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
