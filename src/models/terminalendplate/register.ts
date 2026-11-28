import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTerminalEndPlateModelString } from "./parse-model-string"
import { terminalEndPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "terminalendplate",
  schema: terminalEndPlateModelDefinitionSchema,
  parse: parseTerminalEndPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
