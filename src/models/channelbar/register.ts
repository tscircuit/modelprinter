import { defineModel, type ModelRegistry } from "../../model-registry"
import { channelBarModelDefinitionSchema } from "./schema"
import { parseChannelBarModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "channelbar",
  schema: channelBarModelDefinitionSchema,
  parse: parseChannelBarModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
