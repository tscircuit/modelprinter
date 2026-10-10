import { defineModel, type ModelRegistry } from "../../model-registry"
import { hatSectionModelDefinitionSchema } from "./schema"
import { parseHatSectionModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "hatsection",
  schema: hatSectionModelDefinitionSchema,
  parse: parseHatSectionModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
