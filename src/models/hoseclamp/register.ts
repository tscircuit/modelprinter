import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHoseClampModelParams } from "./parse-model-string"
import { hoseClampModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "hoseclamp",
  schema: hoseClampModelDefinitionSchema,
  parse: parseHoseClampModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
