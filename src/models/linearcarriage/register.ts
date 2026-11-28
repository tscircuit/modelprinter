import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearCarriageModelString } from "./parse-model-string"
import { linearCarriageModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "linearcarriage",
  schema: linearCarriageModelDefinitionSchema,
  parse: parseLinearCarriageModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
