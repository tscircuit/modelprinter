import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAnnularBlankModelString } from "./parse-model-string"
import { annularBlankModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "annularblank",
  schema: annularBlankModelDefinitionSchema,
  parse: parseAnnularBlankModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
