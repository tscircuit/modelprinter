import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWireRopeClipModelString } from "./parse-model-string"
import { wireRopeClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wireropeclip",
  schema: wireRopeClipModelDefinitionSchema,
  parse: parseWireRopeClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
