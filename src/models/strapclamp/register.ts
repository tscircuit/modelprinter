import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseStrapClampModelString } from "./parse-model-string"
import { strapClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "strapclamp",
  schema: strapClampModelDefinitionSchema,
  parse: parseStrapClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
