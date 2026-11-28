import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHeaderSocketModelString } from "./parse-model-string"
import { headerSocketModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "headersocket",
  schema: headerSocketModelDefinitionSchema,
  parse: parseHeaderSocketModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
