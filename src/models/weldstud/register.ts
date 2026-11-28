import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWeldStudModelString } from "./parse-model-string"
import { weldStudModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "weldstud",
  schema: weldStudModelDefinitionSchema,
  parse: parseWeldStudModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
