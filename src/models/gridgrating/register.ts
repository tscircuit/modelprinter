import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGridGratingModelString } from "./parse-model-string"
import { gridGratingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "gridgrating",
  schema: gridGratingModelDefinitionSchema,
  parse: parseGridGratingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
