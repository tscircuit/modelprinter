import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHexNutModelParams } from "./parse-model-string"
import { hexNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hexnut",
  schema: hexNutModelDefinitionSchema,
  parse: parseHexNutModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
