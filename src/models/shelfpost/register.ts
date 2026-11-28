import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShelfPostModelString } from "./parse-model-string"
import { shelfPostModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shelfpost",
  schema: shelfPostModelDefinitionSchema,
  parse: parseShelfPostModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
