import { defineModel, type ModelRegistry } from "../../model-registry"
import { flatCableClipModelDefinitionSchema } from "./schema"
import { parseFlatCableClipModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flatcableclip",
  schema: flatCableClipModelDefinitionSchema,
  parse: parseFlatCableClipModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
