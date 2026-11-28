import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFuseBlockModelString } from "./parse-model-string"
import { fuseBlockModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fuseblock",
  schema: fuseBlockModelDefinitionSchema,
  parse: parseFuseBlockModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
