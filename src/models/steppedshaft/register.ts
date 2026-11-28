import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSteppedShaftModelString } from "./parse-model-string"
import { steppedShaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "steppedshaft",
  schema: steppedShaftModelDefinitionSchema,
  parse: parseSteppedShaftModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
