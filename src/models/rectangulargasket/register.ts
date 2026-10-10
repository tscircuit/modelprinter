import { defineModel, type ModelRegistry } from "../../model-registry"
import { rectangularGasketModelDefinitionSchema } from "./schema"
import { parseRectangularGasketModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rectangulargasket",
  schema: rectangularGasketModelDefinitionSchema,
  parse: parseRectangularGasketModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
