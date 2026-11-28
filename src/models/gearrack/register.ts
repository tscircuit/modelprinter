import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGearRackModelString } from "./parse-model-string"
import { gearRackModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "gearrack",
  schema: gearRackModelDefinitionSchema,
  parse: parseGearRackModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
