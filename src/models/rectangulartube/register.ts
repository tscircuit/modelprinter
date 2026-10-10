import { defineModel, type ModelRegistry } from "../../model-registry"
import { rectangularTubeModelDefinitionSchema } from "./schema"
import { parseRectangularTubeModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rectangulartube",
  schema: rectangularTubeModelDefinitionSchema,
  parse: parseRectangularTubeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
