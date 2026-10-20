import { defineModel, type ModelRegistry } from "../../model-registry"
import { hingeModelDefinitionSchema } from "./schema"
import { parseHingeModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "hinge",
  schema: hingeModelDefinitionSchema,
  parse: parseHingeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
