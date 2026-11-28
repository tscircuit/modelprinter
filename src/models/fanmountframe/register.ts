import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFanMountFrameModelString } from "./parse-model-string"
import { fanMountFrameModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fanmountframe",
  schema: fanMountFrameModelDefinitionSchema,
  parse: parseFanMountFrameModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
