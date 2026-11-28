import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseNeedleRollerBearingModelString } from "./parse-model-string"
import { needleRollerBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "needlerollerbearing",
  schema: needleRollerBearingModelDefinitionSchema,
  parse: parseNeedleRollerBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
