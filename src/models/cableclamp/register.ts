import { defineModel, type ModelRegistry } from "../../model-registry"
import { cableClampModelDefinitionSchema } from "./schema"
import { parseCableClampModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cableclamp",
  schema: cableClampModelDefinitionSchema,
  parse: parseCableClampModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
