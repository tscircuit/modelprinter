import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareWasherModelString } from "./parse-model-string"
import { squareWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squarewasher",
  schema: squareWasherModelDefinitionSchema,
  parse: parseSquareWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
