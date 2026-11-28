import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOvalFlangeBearingModelString } from "./parse-model-string"
import { ovalFlangeBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ovalflangebearing",
  schema: ovalFlangeBearingModelDefinitionSchema,
  parse: parseOvalFlangeBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
