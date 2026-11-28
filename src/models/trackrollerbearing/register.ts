import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTrackRollerBearingModelString } from "./parse-model-string"
import { trackRollerBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "trackrollerbearing",
  schema: trackRollerBearingModelDefinitionSchema,
  parse: parseTrackRollerBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
