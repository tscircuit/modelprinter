import { defineModel, type ModelRegistry } from "../../model-registry"
import { cylindricalRollerBearingModelDefinitionSchema } from "./schema"
import { parseCylindricalRollerBearingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cylindricalrollerbearing",
  schema: cylindricalRollerBearingModelDefinitionSchema,
  parse: parseCylindricalRollerBearingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
