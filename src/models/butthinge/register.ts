import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseButtHingeModelString } from "./parse-model-string"
import { buttHingeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "butthinge",
  schema: buttHingeModelDefinitionSchema,
  parse: parseButtHingeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
