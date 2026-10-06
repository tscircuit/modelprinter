import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotGussetModelParams } from "./parse-model-string"
import { tSlotGussetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotgusset",
  schema: tSlotGussetModelDefinitionSchema,
  parse: parseTSlotGussetModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
