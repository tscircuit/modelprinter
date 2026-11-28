import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseToroidalCoreModelString } from "./parse-model-string"
import { toroidalCoreModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "toroidalcore",
  schema: toroidalCoreModelDefinitionSchema,
  parse: parseToroidalCoreModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
