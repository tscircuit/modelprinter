import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundFlangeBearingModelString } from "./parse-model-string"
import { roundFlangeBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundflangebearing",
  schema: roundFlangeBearingModelDefinitionSchema,
  parse: parseRoundFlangeBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
