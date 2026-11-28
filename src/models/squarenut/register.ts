import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareNutModelString } from "./parse-model-string"
import { squareNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squarenut",
  schema: squareNutModelDefinitionSchema,
  parse: parseSquareNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
