import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBarrelNutModelString } from "./parse-model-string"
import { barrelNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "barrelnut",
  schema: barrelNutModelDefinitionSchema,
  parse: parseBarrelNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
