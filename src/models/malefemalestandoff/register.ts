import { defineModel, type ModelRegistry } from "../../model-registry"
import { maleFemaleStandoffModelDefinitionSchema } from "./schema"
import { parseMaleFemaleStandoffModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "malefemalestandoff",
  schema: maleFemaleStandoffModelDefinitionSchema,
  parse: parseMaleFemaleStandoffModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
