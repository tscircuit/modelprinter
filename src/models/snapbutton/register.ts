import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSnapButtonModelString } from "./parse-model-string"
import { snapButtonModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "snapbutton",
  schema: snapButtonModelDefinitionSchema,
  parse: parseSnapButtonModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
