import { defineModel, type ModelRegistry } from "../../model-registry"
import { iBeamModelDefinitionSchema } from "./schema"
import { parseIBeamModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "ibeam",
  schema: iBeamModelDefinitionSchema,
  parse: parseIBeamModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
