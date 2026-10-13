import { defineModel, type ModelRegistry } from "../../model-registry"
import { pressureGaugeModelDefinitionSchema } from "./schema"
import { parsePressureGaugeModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pressuregauge",
  schema: pressureGaugeModelDefinitionSchema,
  parse: parsePressureGaugeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
