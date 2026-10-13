import { defineModel, type ModelRegistry } from "../../model-registry"
import { wingNutModelDefinitionSchema } from "./schema"
import { parseWingNutModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "wingnut",
  schema: wingNutModelDefinitionSchema,
  parse: parseWingNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
