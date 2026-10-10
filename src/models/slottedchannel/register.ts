import { defineModel, type ModelRegistry } from "../../model-registry"
import { slottedChannelModelDefinitionSchema } from "./schema"
import { parseSlottedChannelModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "slottedchannel",
  schema: slottedChannelModelDefinitionSchema,
  parse: parseSlottedChannelModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
