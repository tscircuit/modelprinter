import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseButtonScrewModelParams } from "./parse-model-string"
import { buttonScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "buttonscrew",
  schema: buttonScrewModelDefinitionSchema,
  parse: parseButtonScrewModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
