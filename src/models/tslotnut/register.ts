import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotNutModelString } from "./parse-model-string"
import { tSlotNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotnut",
  schema: tSlotNutModelDefinitionSchema,
  parse: parseTSlotNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
