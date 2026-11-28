import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallSplineShaftModelString } from "./parse-model-string"
import { ballSplineShaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballsplineshaft",
  schema: ballSplineShaftModelDefinitionSchema,
  parse: parseBallSplineShaftModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
