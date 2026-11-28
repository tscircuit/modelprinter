import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplitCaseModelString } from "./parse-model-string"
import { splitCaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splitcase",
  schema: splitCaseModelDefinitionSchema,
  parse: parseSplitCaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
