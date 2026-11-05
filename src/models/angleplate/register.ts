import { defineModel, type ModelRegistry } from "../../model-registry"
import { anglePlateModelDefinitionSchema } from "./schema"
import { parseAnglePlateModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "angleplate",
  schema: anglePlateModelDefinitionSchema,
  parse: parseAnglePlateModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
