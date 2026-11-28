import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFuseHolderModelString } from "./parse-model-string"
import { fuseHolderModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fuseholder",
  schema: fuseHolderModelDefinitionSchema,
  parse: parseFuseHolderModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
