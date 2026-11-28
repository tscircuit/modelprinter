import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLinearBallBushingModelString } from "./parse-model-string"
import { linearBallBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "linearballbushing",
  schema: linearBallBushingModelDefinitionSchema,
  parse: parseLinearBallBushingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
