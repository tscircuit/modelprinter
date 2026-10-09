import { defineModel, type ModelRegistry } from "../../model-registry"
import { setscrewModelDefinitionSchema } from "./schema"
import { parseSetScrewModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "setscrew",
  schema: setscrewModelDefinitionSchema,
  parse: parseSetScrewModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
