import { defineModel, type ModelRegistry } from "../../model-registry"
import { stepBlockModelDefinitionSchema } from "./schema"
import { parseStepBlockModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "stepblock",
  schema: stepBlockModelDefinitionSchema,
  parse: parseStepBlockModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
