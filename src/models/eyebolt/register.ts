import { defineModel, type ModelRegistry } from "../../model-registry"
import { eyeBoltModelDefinitionSchema } from "./schema"
import { parseEyeBoltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "eyebolt",
  schema: eyeBoltModelDefinitionSchema,
  parse: parseEyeBoltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
