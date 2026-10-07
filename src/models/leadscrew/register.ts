import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeadScrewModelParams } from "./parse-model-string"
import { leadScrewModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "leadscrew",
  schema: leadScrewModelDefinitionSchema,
  parse: parseLeadScrewModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
