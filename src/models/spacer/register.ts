import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSpacerModelParams } from "./parse-model-string"
import { spacerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "spacer",
  schema: spacerModelDefinitionSchema,
  parse: parseSpacerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
