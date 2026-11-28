import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMicroswitchModelString } from "./parse-model-string"
import { microswitchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "microswitch",
  schema: microswitchModelDefinitionSchema,
  parse: parseMicroswitchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
