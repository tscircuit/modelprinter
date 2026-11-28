import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeadScrewNutModelString } from "./parse-model-string"
import { leadScrewNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "leadscrewnut",
  schema: leadScrewNutModelDefinitionSchema,
  parse: parseLeadScrewNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
