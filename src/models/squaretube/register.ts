import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSquareTubeModelParams } from "./parse-model-string"
import { squareTubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "squaretube",
  schema: squareTubeModelDefinitionSchema,
  parse: parseSquareTubeModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
