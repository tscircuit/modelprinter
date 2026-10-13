import { defineModel, type ModelRegistry } from "../../model-registry"
import { universalJointModelDefinitionSchema } from "./schema"
import { parseUniversalJointModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "universaljoint",
  schema: universalJointModelDefinitionSchema,
  parse: parseUniversalJointModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
