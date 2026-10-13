import { defineModel, type ModelRegistry } from "../../model-registry"
import { gearRackModelDefinitionSchema } from "./schema"
import { parseGearRackModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "gearrack",
  schema: gearRackModelDefinitionSchema,
  parse: parseGearRackModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
