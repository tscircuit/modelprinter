import { defineModel, type ModelRegistry } from "../../model-registry"
import { bellevilleWasherModelDefinitionSchema } from "./schema"
import { parseBellevilleWasherModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "bellevillewasher",
  schema: bellevilleWasherModelDefinitionSchema,
  parse: parseBellevilleWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
