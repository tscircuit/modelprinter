import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTriangularBarModelParams } from "./parse-model-string"
import { triangularBarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "triangularbar",
  schema: triangularBarModelDefinitionSchema,
  parse: parseTriangularBarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
