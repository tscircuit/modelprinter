import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWedgeBlankModelParams } from "./parse-model-string"
import { wedgeBlankModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wedgeblank",
  schema: wedgeBlankModelDefinitionSchema,
  parse: parseWedgeBlankModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
