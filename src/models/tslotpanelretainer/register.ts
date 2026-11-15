import { defineModel, type ModelRegistry } from "../../model-registry"
import { tSlotPanelRetainerModelDefinitionSchema } from "./schema"
import { parseTSlotPanelRetainerModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "tslotpanelretainer",
  schema: tSlotPanelRetainerModelDefinitionSchema,
  parse: parseTSlotPanelRetainerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
