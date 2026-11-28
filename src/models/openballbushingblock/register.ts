import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOpenBallBushingBlockModelString } from "./parse-model-string"
import { openBallBushingBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "openballbushingblock",
  schema: openBallBushingBlockModelDefinitionSchema,
  parse: parseOpenBallBushingBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
