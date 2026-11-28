import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCamFollowerModelString } from "./parse-model-string"
import { camFollowerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "camfollower",
  schema: camFollowerModelDefinitionSchema,
  parse: parseCamFollowerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
