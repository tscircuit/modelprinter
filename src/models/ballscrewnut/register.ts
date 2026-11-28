import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallScrewNutModelString } from "./parse-model-string"
import { ballScrewNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballscrewnut",
  schema: ballScrewNutModelDefinitionSchema,
  parse: parseBallScrewNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
