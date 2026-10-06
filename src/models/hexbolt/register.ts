import { defineModel, type ModelRegistry } from "../../model-registry"
import { hexBoltModelDefinitionSchema } from "./schema"
import { parseHexBoltModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "hexbolt",
  schema: hexBoltModelDefinitionSchema,
  parse: parseHexBoltModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
