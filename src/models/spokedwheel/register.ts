import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpokedWheelModelString } from "./parse-model-string"
import { spokedWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "spokedwheel",
  schema: spokedWheelModelDefinitionSchema,
  parse: parseSpokedWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
