import { defineModel, type ModelRegistry } from "../../model-registry"
import { keyWasherModelDefinitionSchema } from "./schema"
import { parseKeyWasherModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "keywasher",
  schema: keyWasherModelDefinitionSchema,
  parse: parseKeyWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
