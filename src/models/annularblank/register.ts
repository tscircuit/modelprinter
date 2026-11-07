import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAnnularBlankModelParams } from "./parse-model-string"
import { annularBlankModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "annularblank",
  schema: annularBlankModelDefinitionSchema,
  parse: parseAnnularBlankModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
