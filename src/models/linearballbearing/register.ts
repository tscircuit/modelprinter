import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearBallBearingModelParams } from "./parse-model-string"
import { linearBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "linearballbearing",
  schema: linearBallBearingModelDefinitionSchema,
  parse: parseLinearBallBearingModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
