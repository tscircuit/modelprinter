import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlainBushingModelParams } from "./parse-model-string"
import { plainBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "plainbushing",
  schema: plainBushingModelDefinitionSchema,
  parse: parsePlainBushingModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
