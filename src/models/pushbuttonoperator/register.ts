import { defineModel, type ModelRegistry } from "../../model-registry"
import { pushbuttonOperatorModelDefinitionSchema } from "./schema"
import { parsePushbuttonOperatorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pushbuttonoperator",
  schema: pushbuttonOperatorModelDefinitionSchema,
  parse: parsePushbuttonOperatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
