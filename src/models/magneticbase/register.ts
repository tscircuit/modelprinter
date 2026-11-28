import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMagneticBaseModelString } from "./parse-model-string"
import { magneticBaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "magneticbase",
  schema: magneticBaseModelDefinitionSchema,
  parse: parseMagneticBaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
