import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBowShackleModelString } from "./parse-model-string"
import { bowShackleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bowshackle",
  schema: bowShackleModelDefinitionSchema,
  parse: parseBowShackleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
