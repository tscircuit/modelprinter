import { defineModel, type ModelRegistry } from "../../model-registry"
import { shoulderBoltModelDefinitionSchema } from "./schema"
import { parseShoulderBoltModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "shoulderbolt",
  schema: shoulderBoltModelDefinitionSchema,
  parse: parseShoulderBoltModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
