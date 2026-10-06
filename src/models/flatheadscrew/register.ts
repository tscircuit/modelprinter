import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlatHeadScrewModelParams } from "./parse-model-string"
import { flatHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flatheadscrew",
  schema: flatHeadScrewModelDefinitionSchema,
  parse: parseFlatHeadScrewModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
