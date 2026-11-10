import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePerforatedTubeModelParams } from "./parse-model-string"
import { perforatedTubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "perforatedtube",
  schema: perforatedTubeModelDefinitionSchema,
  parse: parsePerforatedTubeModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
