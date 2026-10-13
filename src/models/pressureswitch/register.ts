import { defineModel, type ModelRegistry } from "../../model-registry"
import { pressureSwitchModelDefinitionSchema } from "./schema"
import { parsePressureSwitchModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pressureswitch",
  schema: pressureSwitchModelDefinitionSchema,
  parse: parsePressureSwitchModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
