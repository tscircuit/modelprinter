import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBrakedCasterModelString } from "./parse-model-string"
import { brakedCasterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "brakedcaster",
  schema: brakedCasterModelDefinitionSchema,
  parse: parseBrakedCasterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
