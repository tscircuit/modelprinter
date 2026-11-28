import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSphericalPlainBearingModelString } from "./parse-model-string"
import { sphericalPlainBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "sphericalplainbearing",
  schema: sphericalPlainBearingModelDefinitionSchema,
  parse: parseSphericalPlainBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
