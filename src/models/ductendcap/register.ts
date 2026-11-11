import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDuctEndCapModelParams } from "./parse-model-string"
import { ductEndCapModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ductendcap",
  schema: ductEndCapModelDefinitionSchema,
  parse: parseDuctEndCapModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
