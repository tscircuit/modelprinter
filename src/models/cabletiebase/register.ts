import { defineModel, type ModelRegistry } from "../../model-registry"
import { cableTieBaseModelDefinitionSchema } from "./schema"
import { parseCableTieBaseModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cabletiebase",
  schema: cableTieBaseModelDefinitionSchema,
  parse: parseCableTieBaseModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
