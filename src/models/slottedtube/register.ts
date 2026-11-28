import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSlottedTubeModelString } from "./parse-model-string"
import { slottedTubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "slottedtube",
  schema: slottedTubeModelDefinitionSchema,
  parse: parseSlottedTubeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
