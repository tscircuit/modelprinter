import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseExternalToothWasherModelString } from "./parse-model-string"
import { externalToothWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "externaltoothwasher",
  schema: externalToothWasherModelDefinitionSchema,
  parse: parseExternalToothWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
