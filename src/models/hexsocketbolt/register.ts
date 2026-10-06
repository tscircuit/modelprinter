import { defineModel, type ModelRegistry } from "../../model-registry"
import { hexSocketBoltModelDefinitionSchema } from "../../hex-socket-bolt-schema"
import { parseHexSocketBoltModelParams } from "../../parse-hex-socket-bolt-model-string"

export const model = defineModel({
  name: "hexsocketbolt",
  schema: hexSocketBoltModelDefinitionSchema,
  parse: parseHexSocketBoltModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
