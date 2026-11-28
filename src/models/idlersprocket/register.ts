import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseIdlerSprocketModelString } from "./parse-model-string"
import { idlerSprocketModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "idlersprocket",
  schema: idlerSprocketModelDefinitionSchema,
  parse: parseIdlerSprocketModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
