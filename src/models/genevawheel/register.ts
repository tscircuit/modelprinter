import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGenevaWheelModelString } from "./parse-model-string"
import { genevaWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "genevawheel",
  schema: genevaWheelModelDefinitionSchema,
  parse: parseGenevaWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
