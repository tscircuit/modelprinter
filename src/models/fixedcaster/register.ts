import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFixedCasterModelString } from "./parse-model-string"
import { fixedCasterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fixedcaster",
  schema: fixedCasterModelDefinitionSchema,
  parse: parseFixedCasterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
