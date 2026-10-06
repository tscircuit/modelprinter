import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRigidCouplerModelParams } from "./parse-model-string"
import { rigidCouplerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rigidcoupler",
  schema: rigidCouplerModelDefinitionSchema,
  parse: parseRigidCouplerModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
