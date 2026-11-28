import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCastellatedNutModelString } from "./parse-model-string"
import { castellatedNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "castellatednut",
  schema: castellatedNutModelDefinitionSchema,
  parse: parseCastellatedNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
