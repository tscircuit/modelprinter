import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTurnbuckleModelString } from "./parse-model-string"
import { turnbuckleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "turnbuckle",
  schema: turnbuckleModelDefinitionSchema,
  parse: parseTurnbuckleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
