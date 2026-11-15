import { defineModel, type ModelRegistry } from "../../model-registry"
import { pcbRailModelDefinitionSchema } from "./schema"
import { parsePcbRailModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pcbrail",
  schema: pcbRailModelDefinitionSchema,
  parse: parsePcbRailModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
