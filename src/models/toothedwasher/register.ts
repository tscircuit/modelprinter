import { defineModel, type ModelRegistry } from "../../model-registry"
import { toothedWasherModelDefinitionSchema } from "./schema"
import { parseToothedWasherModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "toothedwasher",
  schema: toothedWasherModelDefinitionSchema,
  parse: parseToothedWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
