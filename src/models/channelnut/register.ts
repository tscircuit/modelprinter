import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseChannelNutModelString } from "./parse-model-string"
import { channelNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "channelnut",
  schema: channelNutModelDefinitionSchema,
  parse: parseChannelNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
