import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSwivelCasterModelString } from "./parse-model-string"
import { swivelCasterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "swivelcaster",
  schema: swivelCasterModelDefinitionSchema,
  parse: parseSwivelCasterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
