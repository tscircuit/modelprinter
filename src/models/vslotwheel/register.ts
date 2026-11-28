import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVSlotWheelModelString } from "./parse-model-string"
import { vSlotWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vslotwheel",
  schema: vSlotWheelModelDefinitionSchema,
  parse: parseVSlotWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
