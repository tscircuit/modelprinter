import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseEyeNutModelString } from "./parse-model-string"
import { eyeNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "eyenut",
  schema: eyeNutModelDefinitionSchema,
  parse: parseEyeNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
