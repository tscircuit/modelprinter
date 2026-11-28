import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShelfSplitSleeveModelString } from "./parse-model-string"
import { shelfSplitSleeveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shelfsplitsleeve",
  schema: shelfSplitSleeveModelDefinitionSchema,
  parse: parseShelfSplitSleeveModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
