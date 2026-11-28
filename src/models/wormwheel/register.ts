import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWormWheelModelString } from "./parse-model-string"
import { wormWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wormwheel",
  schema: wormWheelModelDefinitionSchema,
  parse: parseWormWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
