import { defineModel, type ModelRegistry } from "../../model-registry"
import { casterModelDefinitionSchema } from "./schema"
import { parseCasterModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "caster",
  schema: casterModelDefinitionSchema,
  parse: parseCasterModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
