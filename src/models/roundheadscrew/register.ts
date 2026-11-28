import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundHeadScrewModelString } from "./parse-model-string"
import { roundHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundheadscrew",
  schema: roundHeadScrewModelDefinitionSchema,
  parse: parseRoundHeadScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
