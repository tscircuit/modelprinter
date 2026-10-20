import { defineModel, type ModelRegistry } from "../../model-registry"
import { pcbEdgeSupportModelDefinitionSchema } from "./schema"
import { parsePcbEdgeSupportModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pcbedgesupport",
  schema: pcbEdgeSupportModelDefinitionSchema,
  parse: parsePcbEdgeSupportModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
