import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHookBoltModelString } from "./parse-model-string"
import { hookBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hookbolt",
  schema: hookBoltModelDefinitionSchema,
  parse: parseHookBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
