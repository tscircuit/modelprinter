import { defineModel, type ModelRegistry } from "../../model-registry"
import { pneumaticCylinderModelDefinitionSchema } from "./schema"
import { parsePneumaticCylinderModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pneumaticcylinder",
  schema: pneumaticCylinderModelDefinitionSchema,
  parse: parsePneumaticCylinderModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
