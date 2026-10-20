import { defineModel, type ModelRegistry } from "../../model-registry"
import { pottingBoxModelDefinitionSchema } from "./schema"
import { parsePottingBoxModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pottingbox",
  schema: pottingBoxModelDefinitionSchema,
  parse: parsePottingBoxModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
