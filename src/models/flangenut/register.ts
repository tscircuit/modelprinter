import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangeNutModelParams } from "./parse-model-string"
import { flangeNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangenut",
  schema: flangeNutModelDefinitionSchema,
  parse: parseFlangeNutModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
