import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLeadscrewSupportModelString } from "./parse-model-string"
import { leadscrewSupportModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "leadscrewsupport",
  schema: leadscrewSupportModelDefinitionSchema,
  parse: parseLeadscrewSupportModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
