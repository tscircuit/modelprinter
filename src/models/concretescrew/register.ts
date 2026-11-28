import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseConcreteScrewModelString } from "./parse-model-string"
import { concreteScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "concretescrew",
  schema: concreteScrewModelDefinitionSchema,
  parse: parseConcreteScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
