import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSnapClipModelString } from "./parse-model-string"
import { snapClipModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pcbsnapclip",
  schema: snapClipModelDefinitionSchema,
  parse: parseSnapClipModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
