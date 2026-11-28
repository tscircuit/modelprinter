import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangeBearingModelString } from "./parse-model-string"
import { flangeBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangebearing",
  schema: flangeBearingModelDefinitionSchema,
  parse: parseFlangeBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
