import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClevisPinModelString } from "./parse-model-string"
import { clevisPinModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clevispin",
  schema: clevisPinModelDefinitionSchema,
  parse: parseClevisPinModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
