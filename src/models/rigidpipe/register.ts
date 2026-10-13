import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRigidPipeModelParams } from "./parse-model-string"
import { rigidPipeModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "rigidpipe",
  schema: rigidPipeModelDefinitionSchema,
  parse: parseRigidPipeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
