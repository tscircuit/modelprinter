import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePluggableTerminalModelString } from "./parse-model-string"
import { pluggableTerminalModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pluggableterminal",
  schema: pluggableTerminalModelDefinitionSchema,
  parse: parsePluggableTerminalModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
