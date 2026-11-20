import { defineModel, type ModelRegistry } from "../../model-registry"
import { maleStandoffModelDefinitionSchema } from "./schema"
import { parseMaleStandoffModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "malestandoff",
  schema: maleStandoffModelDefinitionSchema,
  parse: parseMaleStandoffModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
