import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOctagonalBarModelParams } from "./parse-model-string"
import { octagonalBarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "octagonalbar",
  schema: octagonalBarModelDefinitionSchema,
  parse: parseOctagonalBarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
