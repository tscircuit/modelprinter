import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallBushingBlockModelString } from "./parse-model-string"
import { ballBushingBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballbushingblock",
  schema: ballBushingBlockModelDefinitionSchema,
  parse: parseBallBushingBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
