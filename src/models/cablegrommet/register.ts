import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCableGrommetModelParams } from "./parse-model-string"
import { cableGrommetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cablegrommet",
  schema: cableGrommetModelDefinitionSchema,
  parse: parseCableGrommetModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
