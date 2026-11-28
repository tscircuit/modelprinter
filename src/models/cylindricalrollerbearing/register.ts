import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCylindricalRollerBearingModelString } from "./parse-model-string"
import { cylindricalRollerBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cylindricalrollerbearing",
  schema: cylindricalRollerBearingModelDefinitionSchema,
  parse: parseCylindricalRollerBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
