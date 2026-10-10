import { defineModel, type ModelRegistry } from "../../model-registry"
import { splitGrommetModelDefinitionSchema } from "./schema"
import { parseSplitGrommetModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "splitgrommet",
  schema: splitGrommetModelDefinitionSchema,
  parse: parseSplitGrommetModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
