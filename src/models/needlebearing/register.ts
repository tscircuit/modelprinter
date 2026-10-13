import { defineModel, type ModelRegistry } from "../../model-registry"
import { needleBearingModelDefinitionSchema } from "./schema"
import { parseNeedleBearingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "needlebearing",
  schema: needleBearingModelDefinitionSchema,
  parse: parseNeedleBearingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
