import { defineModel, type ModelRegistry } from "../../model-registry"
import { dowelPinModelDefinitionSchema } from "./schema"
import { parseDowelPinModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "dowelpin",
  schema: dowelPinModelDefinitionSchema,
  parse: parseDowelPinModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
