import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHangerBoltModelString } from "./parse-model-string"
import { hangerBoltModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hangerbolt",
  schema: hangerBoltModelDefinitionSchema,
  parse: parseHangerBoltModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
