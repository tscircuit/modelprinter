import { defineModel, type ModelRegistry } from "../../model-registry"
import { sphericalBearingModelDefinitionSchema } from "./schema"
import { parseSphericalBearingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "sphericalbearing",
  schema: sphericalBearingModelDefinitionSchema,
  parse: parseSphericalBearingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
