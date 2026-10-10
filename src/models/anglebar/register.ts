import { defineModel, type ModelRegistry } from "../../model-registry"
import { angleBarModelDefinitionSchema } from "./schema"
import { parseAngleBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "anglebar",
  schema: angleBarModelDefinitionSchema,
  parse: parseAngleBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
