import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTerminalBlockModelString } from "./parse-model-string"
import { terminalBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "terminalblock",
  schema: terminalBlockModelDefinitionSchema,
  parse: parseTerminalBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
