import { defineModel, type ModelRegistry } from "../../model-registry"
import { nylonLockNutModelDefinitionSchema } from "./schema"
import { parseNylonLockNutModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "nylonlocknut",
  schema: nylonLockNutModelDefinitionSchema,
  parse: parseNylonLockNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
