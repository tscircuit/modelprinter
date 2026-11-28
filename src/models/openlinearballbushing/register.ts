import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOpenLinearBallBushingModelString } from "./parse-model-string"
import { openLinearBallBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "openlinearballbushing",
  schema: openLinearBallBushingModelDefinitionSchema,
  parse: parseOpenLinearBallBushingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
