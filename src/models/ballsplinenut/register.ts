import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallSplineNutModelString } from "./parse-model-string"
import { ballSplineNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballsplinenut",
  schema: ballSplineNutModelDefinitionSchema,
  parse: parseBallSplineNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
