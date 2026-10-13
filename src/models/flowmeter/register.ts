import { defineModel, type ModelRegistry } from "../../model-registry"
import { flowMeterModelDefinitionSchema } from "./schema"
import { parseFlowMeterModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flowmeter",
  schema: flowMeterModelDefinitionSchema,
  parse: parseFlowMeterModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
