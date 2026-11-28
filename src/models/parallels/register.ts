import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseParallelsModelString } from "./parse-model-string"
import { parallelsModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "parallels",
  schema: parallelsModelDefinitionSchema,
  parse: parseParallelsModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
