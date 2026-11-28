import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePushbuttonBoxModelString } from "./parse-model-string"
import { pushbuttonBoxModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pushbuttonbox",
  schema: pushbuttonBoxModelDefinitionSchema,
  parse: parsePushbuttonBoxModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
