import { defineModel, type ModelRegistry } from "../../model-registry"
import { tSlotNutModelDefinitionSchema } from "./schema"
import { parseTSlotNutModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "tslotnut",
  schema: tSlotNutModelDefinitionSchema,
  parse: parseTSlotNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
