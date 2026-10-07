import { defineModel, type ModelRegistry } from "../../model-registry"
import { torsionSpringModelDefinitionSchema } from "./schema"
import { parseTorsionSpringModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "torsionspring",
  schema: torsionSpringModelDefinitionSchema,
  parse: parseTorsionSpringModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
