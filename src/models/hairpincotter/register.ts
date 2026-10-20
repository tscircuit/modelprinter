import { defineModel, type ModelRegistry } from "../../model-registry"
import { hairpinCotterModelDefinitionSchema } from "./schema"
import { parseHairpinCotterModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "hairpincotter",
  schema: hairpinCotterModelDefinitionSchema,
  parse: parseHairpinCotterModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
