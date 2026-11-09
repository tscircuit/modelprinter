import { defineModel, type ModelRegistry } from "../../model-registry"
import { starKnobModelDefinitionSchema } from "./schema"
import { parseStarKnobModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "starknob",
  schema: starKnobModelDefinitionSchema,
  parse: parseStarKnobModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
