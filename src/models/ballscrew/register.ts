import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallScrewModelString } from "./parse-model-string"
import { ballScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballscrew",
  schema: ballScrewModelDefinitionSchema,
  parse: parseBallScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
