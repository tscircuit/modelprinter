import { defineModel, type ModelRegistry } from "../../model-registry"
import { squareKeyModelDefinitionSchema } from "./schema"
import { parseSquareKeyModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "squarekey",
  schema: squareKeyModelDefinitionSchema,
  parse: parseSquareKeyModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
