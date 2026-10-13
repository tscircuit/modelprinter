import { defineModel, type ModelRegistry } from "../../model-registry"
import { selectorOperatorModelDefinitionSchema } from "./schema"
import { parseSelectorOperatorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "selectoroperator",
  schema: selectorOperatorModelDefinitionSchema,
  parse: parseSelectorOperatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
