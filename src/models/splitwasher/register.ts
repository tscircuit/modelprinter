import { defineModel, type ModelRegistry } from "../../model-registry"
import { splitWasherModelDefinitionSchema } from "./schema"
import { parseSplitWasherModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "splitwasher",
  schema: splitWasherModelDefinitionSchema,
  parse: parseSplitWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
