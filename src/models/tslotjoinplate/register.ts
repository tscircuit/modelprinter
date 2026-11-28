import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotJoinPlateModelString } from "./parse-model-string"
import { tSlotJoinPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotjoinplate",
  schema: tSlotJoinPlateModelDefinitionSchema,
  parse: parseTSlotJoinPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
