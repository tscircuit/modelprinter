import { defineModel, type ModelRegistry } from "../../model-registry"
import { cableCombModelDefinitionSchema } from "./schema"
import { parseCableCombModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cablecomb",
  schema: cableCombModelDefinitionSchema,
  parse: parseCableCombModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
