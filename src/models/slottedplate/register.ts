import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSlottedPlateModelString } from "./parse-model-string"
import { slottedPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "slottedplate",
  schema: slottedPlateModelDefinitionSchema,
  parse: parseSlottedPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
