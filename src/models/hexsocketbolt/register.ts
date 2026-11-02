import { defineModel, type ModelRegistry } from "../../model-registry"
import { hexSocketBoltModelDefinitionSchema } from "../../hex-socket-bolt-schema"
import { parseHexSocketBoltModelParams } from "../../parse-hex-socket-bolt-model-string"

import {
  isHexSocketBoltShorthand,
  normalizeHexSocketBoltModelString,
} from "./normalize-model-string"

export const model = defineModel({
  name: "hexsocketbolt",
  schema: hexSocketBoltModelDefinitionSchema,
  parse: parseHexSocketBoltModelParams,
  matchesString: isHexSocketBoltShorthand,
  normalizeString: normalizeHexSocketBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
