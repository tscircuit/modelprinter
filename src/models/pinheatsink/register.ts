import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePinHeatsinkModelString } from "./parse-model-string"
import { pinHeatsinkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pinheatsink",
  schema: pinHeatsinkModelDefinitionSchema,
  parse: parsePinHeatsinkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
