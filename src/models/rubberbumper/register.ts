import { defineModel, type ModelRegistry } from "../../model-registry"
import { rubberBumperModelDefinitionSchema } from "./schema"
import { parseRubberBumperModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rubberbumper",
  schema: rubberBumperModelDefinitionSchema,
  parse: parseRubberBumperModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
