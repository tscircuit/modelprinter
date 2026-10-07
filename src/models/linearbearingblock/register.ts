import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearBearingBlockModelParams } from "./parse-model-string"
import { linearBearingBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "linearbearingblock",
  schema: linearBearingBlockModelDefinitionSchema,
  parse: parseLinearBearingBlockModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
