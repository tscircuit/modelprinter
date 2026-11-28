import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotFloorBracketModelString } from "./parse-model-string"
import { tSlotFloorBracketModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotfloorbracket",
  schema: tSlotFloorBracketModelDefinitionSchema,
  parse: parseTSlotFloorBracketModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
