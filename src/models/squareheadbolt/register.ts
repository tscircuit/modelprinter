import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareHeadBoltModelString } from "./parse-model-string"
import { squareHeadBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squareheadbolt",
  schema: squareHeadBoltModelDefinitionSchema,
  parse: parseSquareHeadBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
