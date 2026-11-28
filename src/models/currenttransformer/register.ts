import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCurrentTransformerModelString } from "./parse-model-string"
import { currentTransformerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "currenttransformer",
  schema: currentTransformerModelDefinitionSchema,
  parse: parseCurrentTransformerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
