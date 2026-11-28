import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseYokeFollowerModelString } from "./parse-model-string"
import { yokeFollowerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "yokefollower",
  schema: yokeFollowerModelDefinitionSchema,
  parse: parseYokeFollowerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
