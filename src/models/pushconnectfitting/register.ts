import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePushConnectFittingModelParams } from "./parse-model-string"
import { pushConnectFittingModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pushconnectfitting",
  schema: pushConnectFittingModelDefinitionSchema,
  parse: parsePushConnectFittingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
