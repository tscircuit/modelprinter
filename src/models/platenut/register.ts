import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlateNutModelString } from "./parse-model-string"
import { plateNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "platenut",
  schema: plateNutModelDefinitionSchema,
  parse: parsePlateNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
