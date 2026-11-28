import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseInternalToothWasherModelString } from "./parse-model-string"
import { internalToothWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "internaltoothwasher",
  schema: internalToothWasherModelDefinitionSchema,
  parse: parseInternalToothWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
