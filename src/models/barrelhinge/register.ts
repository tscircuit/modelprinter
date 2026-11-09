import { defineModel, type ModelRegistry } from "../../model-registry"
import { barrelHingeModelDefinitionSchema } from "./schema"
import { parseBarrelHingeModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "barrelhinge",
  schema: barrelHingeModelDefinitionSchema,
  parse: parseBarrelHingeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
