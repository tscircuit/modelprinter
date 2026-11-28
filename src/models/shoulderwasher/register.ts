import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShoulderWasherModelString } from "./parse-model-string"
import { shoulderWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shoulderwasher",
  schema: shoulderWasherModelDefinitionSchema,
  parse: parseShoulderWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
