import { defineModel, type ModelRegistry } from "../../model-registry"
import { tSlotEndCapModelDefinitionSchema } from "./schema"
import { parseTSlotEndCapModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "tslotendcap",
  schema: tSlotEndCapModelDefinitionSchema,
  parse: parseTSlotEndCapModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
