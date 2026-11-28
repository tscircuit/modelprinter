import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotGantryPlateModelString } from "./parse-model-string"
import { tSlotGantryPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotgantryplate",
  schema: tSlotGantryPlateModelDefinitionSchema,
  parse: parseTSlotGantryPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
