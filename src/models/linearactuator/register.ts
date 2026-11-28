import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearActuatorModelString } from "./parse-model-string"
import { linearActuatorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "linearactuator",
  schema: linearActuatorModelDefinitionSchema,
  parse: parseLinearActuatorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
