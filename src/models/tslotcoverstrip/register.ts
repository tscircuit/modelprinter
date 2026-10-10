import { defineModel, type ModelRegistry } from "../../model-registry"
import { tSlotCoverStripModelDefinitionSchema } from "./schema"
import { parseTSlotCoverStripModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "tslotcoverstrip",
  schema: tSlotCoverStripModelDefinitionSchema,
  parse: parseTSlotCoverStripModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
