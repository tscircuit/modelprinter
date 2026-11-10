import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseForkWasherModelParams } from "./parse-model-string"
import { forkWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "forkwasher",
  schema: forkWasherModelDefinitionSchema,
  parse: parseForkWasherModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
