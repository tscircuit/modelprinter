import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEyeHookModelString } from "./parse-model-string"
import { eyeHookModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "eyehook",
  schema: eyeHookModelDefinitionSchema,
  parse: parseEyeHookModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
