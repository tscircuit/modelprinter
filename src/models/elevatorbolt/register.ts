import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseElevatorBoltModelString } from "./parse-model-string"
import { elevatorBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "elevatorbolt",
  schema: elevatorBoltModelDefinitionSchema,
  parse: parseElevatorBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
