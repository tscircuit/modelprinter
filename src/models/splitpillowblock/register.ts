import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplitPillowBlockModelString } from "./parse-model-string"
import { splitPillowBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splitpillowblock",
  schema: splitPillowBlockModelDefinitionSchema,
  parse: parseSplitPillowBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
