import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeadScrewModelString } from "./parse-model-string"
import { leadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "leadscrew",
  schema: leadScrewModelDefinitionSchema,
  parse: parseLeadScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
