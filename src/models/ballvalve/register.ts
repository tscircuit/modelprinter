import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallValveModelParams } from "./parse-model-string"
import { ballValveModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "ballvalve",
  schema: ballValveModelDefinitionSchema,
  parse: parseBallValveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
