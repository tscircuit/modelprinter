import { defineModel, type ModelRegistry } from "../../model-registry"
import { bevelGearModelDefinitionSchema } from "./schema"
import { parseBevelGearModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "bevelgear",
  schema: bevelGearModelDefinitionSchema,
  parse: parseBevelGearModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
