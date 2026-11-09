import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHalfRoundBarModelParams } from "./parse-model-string"
import { halfRoundBarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "halfroundbar",
  schema: halfRoundBarModelDefinitionSchema,
  parse: parseHalfRoundBarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
