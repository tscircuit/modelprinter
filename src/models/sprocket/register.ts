import { defineModel, type ModelRegistry } from "../../model-registry"
import { sprocketModelDefinitionSchema } from "./schema"
import { parseSprocketModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "sprocket",
  schema: sprocketModelDefinitionSchema,
  parse: parseSprocketModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
