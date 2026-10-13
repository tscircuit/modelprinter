import { defineModel, type ModelRegistry } from "../../model-registry"
import { flangeBearingModelDefinitionSchema } from "./schema"
import { parseFlangeBearingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flangebearing",
  schema: flangeBearingModelDefinitionSchema,
  parse: parseFlangeBearingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
