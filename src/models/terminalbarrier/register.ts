import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTerminalBarrierModelString } from "./parse-model-string"
import { terminalBarrierModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "terminalbarrier",
  schema: terminalBarrierModelDefinitionSchema,
  parse: parseTerminalBarrierModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
