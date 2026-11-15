import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCircularBlankModelParams } from "./parse-model-string"
import { circularBlankModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "circularblank",
  schema: circularBlankModelDefinitionSchema,
  parse: parseCircularBlankModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
