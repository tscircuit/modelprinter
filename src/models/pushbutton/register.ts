import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePushbuttonModelString } from "./parse-model-string"
import { pushbuttonModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pushbutton",
  schema: pushbuttonModelDefinitionSchema,
  parse: parsePushbuttonModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
