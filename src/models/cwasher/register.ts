import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCWasherModelParams } from "./parse-model-string"
import { cWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cwasher",
  schema: cWasherModelDefinitionSchema,
  parse: parseCWasherModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
