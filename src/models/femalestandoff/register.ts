import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFemaleStandoffModelParams } from "./parse-model-string"
import { femaleStandoffModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "femalestandoff",
  schema: femaleStandoffModelDefinitionSchema,
  parse: parseFemaleStandoffModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
