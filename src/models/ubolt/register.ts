import { defineModel, type ModelRegistry } from "../../model-registry"
import { uBoltModelDefinitionSchema } from "./schema"
import { parseUBoltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "ubolt",
  schema: uBoltModelDefinitionSchema,
  parse: parseUBoltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
