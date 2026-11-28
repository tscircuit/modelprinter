import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWingNutModelString } from "./parse-model-string"
import { wingNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wingnut",
  schema: wingNutModelDefinitionSchema,
  parse: parseWingNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
