import { defineModel, type ModelRegistry } from "../../model-registry"
import { terminalBlockModelDefinitionSchema } from "./schema"
import { parseTerminalBlockModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "terminalblock",
  schema: terminalBlockModelDefinitionSchema,
  parse: parseTerminalBlockModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
