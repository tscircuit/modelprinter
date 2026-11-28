import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGasketBoxModelString } from "./parse-model-string"
import { gasketBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "gasketbox",
  schema: gasketBoxModelDefinitionSchema,
  parse: parseGasketBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
