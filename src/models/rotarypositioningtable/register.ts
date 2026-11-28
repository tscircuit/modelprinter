import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRotaryPositioningTableModelString } from "./parse-model-string"
import { rotaryPositioningTableModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rotarypositioningtable",
  schema: rotaryPositioningTableModelDefinitionSchema,
  parse: parseRotaryPositioningTableModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
