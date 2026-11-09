import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDWasherModelParams } from "./parse-model-string"
import { dWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dwasher",
  schema: dWasherModelDefinitionSchema,
  parse: parseDWasherModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
