import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseJunctionBoxModelString } from "./parse-model-string"
import { junctionBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "junctionbox",
  schema: junctionBoxModelDefinitionSchema,
  parse: parseJunctionBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
