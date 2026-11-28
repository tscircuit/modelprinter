import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWeldNutModelString } from "./parse-model-string"
import { weldNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "weldnut",
  schema: weldNutModelDefinitionSchema,
  parse: parseWeldNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
