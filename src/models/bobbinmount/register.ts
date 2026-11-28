import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBobbinMountModelString } from "./parse-model-string"
import { bobbinMountModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bobbinmount",
  schema: bobbinMountModelDefinitionSchema,
  parse: parseBobbinMountModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
