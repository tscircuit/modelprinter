import { defineModel, type ModelRegistry } from "../../model-registry"
import { flatWasherModelDefinitionSchema } from "./schema"
import { parseFlatWasherModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flatwasher",
  schema: flatWasherModelDefinitionSchema,
  parse: parseFlatWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
