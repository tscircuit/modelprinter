import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBladeFuseModelString } from "./parse-model-string"
import { bladeFuseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bladefuse",
  schema: bladeFuseModelDefinitionSchema,
  parse: parseBladeFuseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
