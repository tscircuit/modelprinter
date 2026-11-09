import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHollowHexBarModelParams } from "./parse-model-string"
import { hollowHexBarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hollowhexbar",
  schema: hollowHexBarModelDefinitionSchema,
  parse: parseHollowHexBarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
