import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMultiGrommetModelString } from "./parse-model-string"
import { multiGrommetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "multigrommet",
  schema: multiGrommetModelDefinitionSchema,
  parse: parseMultiGrommetModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
