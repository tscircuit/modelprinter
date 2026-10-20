import { defineModel, type ModelRegistry } from "../../model-registry"
import { emergencyStopSwitchModelDefinitionSchema } from "./schema"
import { parseEmergencyStopSwitchModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "emergencystopswitch",
  schema: emergencyStopSwitchModelDefinitionSchema,
  parse: parseEmergencyStopSwitchModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
