import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFrlAssemblyModelString } from "./parse-model-string"
import { frlAssemblyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "frlassembly",
  schema: frlAssemblyModelDefinitionSchema,
  parse: parseFrlAssemblyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
