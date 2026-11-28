import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDinRailClipModelString } from "./parse-model-string"
import { dinRailClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dinrailclip",
  schema: dinRailClipModelDefinitionSchema,
  parse: parseDinRailClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
