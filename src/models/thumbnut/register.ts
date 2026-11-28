import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThumbNutModelString } from "./parse-model-string"
import { thumbNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "thumbnut",
  schema: thumbNutModelDefinitionSchema,
  parse: parseThumbNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
