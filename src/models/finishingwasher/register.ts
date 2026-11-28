import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFinishingWasherModelString } from "./parse-model-string"
import { finishingWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "finishingwasher",
  schema: finishingWasherModelDefinitionSchema,
  parse: parseFinishingWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
