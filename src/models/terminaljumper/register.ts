import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTerminalJumperModelString } from "./parse-model-string"
import { terminalJumperModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "terminaljumper",
  schema: terminalJumperModelDefinitionSchema,
  parse: parseTerminalJumperModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
