import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVRollerBearingModelString } from "./parse-model-string"
import { vRollerBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vrollerbearing",
  schema: vRollerBearingModelDefinitionSchema,
  parse: parseVRollerBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
