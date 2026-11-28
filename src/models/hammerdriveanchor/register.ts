import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHammerDriveAnchorModelString } from "./parse-model-string"
import { hammerDriveAnchorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hammerdriveanchor",
  schema: hammerDriveAnchorModelDefinitionSchema,
  parse: parseHammerDriveAnchorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
