import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCableGlandModelParams } from "./parse-model-string"
import { cableGlandModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cablegland",
  schema: cableGlandModelDefinitionSchema,
  parse: parseCableGlandModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
