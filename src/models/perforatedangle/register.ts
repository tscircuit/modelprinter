import { defineModel, type ModelRegistry } from "../../model-registry"
import { perforatedAngleModelDefinitionSchema } from "./schema"
import { parsePerforatedAngleModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "perforatedangle",
  schema: perforatedAngleModelDefinitionSchema,
  parse: parsePerforatedAngleModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
