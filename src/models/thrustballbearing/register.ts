import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThrustBallBearingModelString } from "./parse-model-string"
import { thrustBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "thrustballbearing",
  schema: thrustBallBearingModelDefinitionSchema,
  parse: parseThrustBallBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
