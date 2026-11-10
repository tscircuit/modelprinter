import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTeeBeamModelParams } from "./parse-model-string"
import { teeBeamModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "teebeam",
  schema: teeBeamModelDefinitionSchema,
  parse: parseTeeBeamModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
