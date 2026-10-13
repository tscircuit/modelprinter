import { defineModel, type ModelRegistry } from "../../model-registry"
import { splitRingHangerModelDefinitionSchema } from "./schema"
import { parseSplitRingHangerModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "splitringhanger",
  schema: splitRingHangerModelDefinitionSchema,
  parse: parseSplitRingHangerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
