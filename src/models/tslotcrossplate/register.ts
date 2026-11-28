import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotCrossPlateModelString } from "./parse-model-string"
import { tSlotCrossPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotcrossplate",
  schema: tSlotCrossPlateModelDefinitionSchema,
  parse: parseTSlotCrossPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
