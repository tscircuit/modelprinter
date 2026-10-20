import { defineModel, type ModelRegistry } from "../../model-registry"
import { clevisModelDefinitionSchema } from "./schema"
import { parseClevisModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "clevis",
  schema: clevisModelDefinitionSchema,
  parse: parseClevisModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
