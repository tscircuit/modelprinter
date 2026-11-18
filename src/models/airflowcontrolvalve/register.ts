import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirFlowControlValveModelParams } from "./parse-model-string"
import { airFlowControlValveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airflowcontrolvalve",
  schema: airFlowControlValveModelDefinitionSchema,
  parse: parseAirFlowControlValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
