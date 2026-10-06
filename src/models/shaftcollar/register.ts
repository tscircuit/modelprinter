import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShaftCollarModelParams } from "./parse-model-string"
import { shaftCollarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shaftcollar",
  schema: shaftCollarModelDefinitionSchema,
  parse: parseShaftCollarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
