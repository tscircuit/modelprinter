import { defineModel, type ModelRegistry } from "../../model-registry"
import { solenoidValveModelDefinitionSchema } from "./schema"
import { parseSolenoidValveModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "solenoidvalve",
  schema: solenoidValveModelDefinitionSchema,
  parse: parseSolenoidValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
