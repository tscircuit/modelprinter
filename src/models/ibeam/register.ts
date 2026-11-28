import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseIBeamModelString } from "./parse-model-string"
import { iBeamModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ibeam",
  schema: iBeamModelDefinitionSchema,
  parse: parseIBeamModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
