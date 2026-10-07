import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearCarriageModelParams } from "./parse-model-string"
import { linearCarriageModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "linearcarriage",
  schema: linearCarriageModelDefinitionSchema,
  parse: parseLinearCarriageModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
