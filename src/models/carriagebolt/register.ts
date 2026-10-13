import { defineModel, type ModelRegistry } from "../../model-registry"
import { carriageBoltModelDefinitionSchema } from "./schema"
import { parseCarriageBoltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "carriagebolt",
  schema: carriageBoltModelDefinitionSchema,
  parse: parseCarriageBoltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
