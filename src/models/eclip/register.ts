import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEClipModelString } from "./parse-model-string"
import { eClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "eclip",
  schema: eClipModelDefinitionSchema,
  parse: parseEClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
