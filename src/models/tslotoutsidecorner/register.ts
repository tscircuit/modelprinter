import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotOutsideCornerModelString } from "./parse-model-string"
import { tSlotOutsideCornerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotoutsidecorner",
  schema: tSlotOutsideCornerModelDefinitionSchema,
  parse: parseTSlotOutsideCornerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
