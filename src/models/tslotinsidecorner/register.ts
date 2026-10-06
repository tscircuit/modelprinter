import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotInsideCornerModelParams } from "./parse-model-string"
import { tSlotInsideCornerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotinsidecorner",
  schema: tSlotInsideCornerModelDefinitionSchema,
  parse: parseTSlotInsideCornerModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
