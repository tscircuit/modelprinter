import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRigidCouplerModelParams } from "./parse-model-string"
import { rigidCouplerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rigidcoupler",
  schema: rigidCouplerModelDefinitionSchema,
  parse: parseRigidCouplerModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseRigidCouplerModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
