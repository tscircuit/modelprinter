import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseNeedleValveModelParams } from "./parse-model-string"
import { needleValveModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "needlevalve",
  schema: needleValveModelDefinitionSchema,
  parse: parseNeedleValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
