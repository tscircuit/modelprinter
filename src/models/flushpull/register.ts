import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlushPullModelString } from "./parse-model-string"
import { flushPullModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flushpull",
  schema: flushPullModelDefinitionSchema,
  parse: parseFlushPullModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
