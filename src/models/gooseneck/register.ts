import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGooseneckModelParams } from "./parse-model-string"
import { gooseneckModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "gooseneck",
  schema: gooseneckModelDefinitionSchema,
  parse: parseGooseneckModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
