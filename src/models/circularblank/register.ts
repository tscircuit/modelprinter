import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCircularBlankModelString } from "./parse-model-string"
import { circularBlankModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "circularblank",
  schema: circularBlankModelDefinitionSchema,
  parse: parseCircularBlankModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
