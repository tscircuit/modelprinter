import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTerminalCoverModelString } from "./parse-model-string"
import { terminalCoverModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "terminalcover",
  schema: terminalCoverModelDefinitionSchema,
  parse: parseTerminalCoverModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
