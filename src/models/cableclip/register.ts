import { defineModel, type ModelRegistry } from "../../model-registry"
import { cableClipModelDefinitionSchema } from "./schema"
import { parseCableClipModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cableclip",
  schema: cableClipModelDefinitionSchema,
  parse: parseCableClipModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
