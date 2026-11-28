import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBeltClampModelString } from "./parse-model-string"
import { beltClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "beltclamp",
  schema: beltClampModelDefinitionSchema,
  parse: parseBeltClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
