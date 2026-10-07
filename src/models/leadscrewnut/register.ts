import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeadScrewNutModelParams } from "./parse-model-string"
import { leadScrewNutModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "leadscrewnut",
  schema: leadScrewNutModelDefinitionSchema,
  parse: parseLeadScrewNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
