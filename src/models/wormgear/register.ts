import { defineModel, type ModelRegistry } from "../../model-registry"
import { wormGearModelDefinitionSchema } from "../../worm-gear-schema"
import { parseWormGearModelParams } from "../../parse-worm-gear-model-string"

export const model = defineModel({
  name: "wormgear",
  schema: wormGearModelDefinitionSchema,
  parse: parseWormGearModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
