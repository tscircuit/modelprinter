import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallStudModelString } from "./parse-model-string"
import { ballStudModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballstud",
  schema: ballStudModelDefinitionSchema,
  parse: parseBallStudModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
