import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseInductiveSensorModelString } from "./parse-model-string"
import { inductiveSensorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "inductivesensor",
  schema: inductiveSensorModelDefinitionSchema,
  parse: parseInductiveSensorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
