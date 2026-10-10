import { defineModel, type ModelRegistry } from "../../model-registry"
import { flatGasketModelDefinitionSchema } from "./schema"
import { parseFlatGasketModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "flatgasket",
  schema: flatGasketModelDefinitionSchema,
  parse: parseFlatGasketModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
