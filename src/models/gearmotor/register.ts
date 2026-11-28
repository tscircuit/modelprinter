import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGearMotorModelString } from "./parse-model-string"
import { gearMotorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "gearmotor",
  schema: gearMotorModelDefinitionSchema,
  parse: parseGearMotorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
