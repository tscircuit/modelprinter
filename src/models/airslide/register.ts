import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirSlideModelParams } from "./parse-model-string"
import { airSlideModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airslide",
  schema: airSlideModelDefinitionSchema,
  parse: parseAirSlideModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
