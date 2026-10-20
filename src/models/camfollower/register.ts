import { defineModel, type ModelRegistry } from "../../model-registry"
import { camFollowerModelDefinitionSchema } from "./schema"
import { parseCamFollowerModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "camfollower",
  schema: camFollowerModelDefinitionSchema,
  parse: parseCamFollowerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
