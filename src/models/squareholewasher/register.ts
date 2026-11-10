import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareHoleWasherModelParams } from "./parse-model-string"
import { squareHoleWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squareholewasher",
  schema: squareHoleWasherModelDefinitionSchema,
  parse: parseSquareHoleWasherModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
