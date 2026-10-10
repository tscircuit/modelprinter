import { defineModel, type ModelRegistry } from "../../model-registry"
import { rectangularBarModelDefinitionSchema } from "./schema"
import { parseRectangularBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rectangularbar",
  schema: rectangularBarModelDefinitionSchema,
  parse: parseRectangularBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
