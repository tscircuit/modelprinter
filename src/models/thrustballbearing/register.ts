import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThrustBallBearingModelParams } from "./parse-model-string"
import { thrustBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "thrustballbearing",
  schema: thrustBallBearingModelDefinitionSchema,
  parse: parseThrustBallBearingModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
