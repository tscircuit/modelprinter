import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTorsionBarModelParams } from "./parse-model-string"
import { torsionBarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "torsionbar",
  schema: torsionBarModelDefinitionSchema,
  parse: parseTorsionBarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
