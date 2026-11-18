import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePressureGaugeModelParams } from "./parse-model-string"
import { pressureGaugeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pressuregauge",
  schema: pressureGaugeModelDefinitionSchema,
  parse: parsePressureGaugeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
