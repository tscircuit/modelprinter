import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePianoHingeModelString } from "./parse-model-string"
import { pianoHingeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pianohinge",
  schema: pianoHingeModelDefinitionSchema,
  parse: parsePianoHingeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
