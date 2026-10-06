import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClampingShaftCollarModelParams } from "./parse-model-string"
import { clampingShaftCollarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clampingshaftcollar",
  schema: clampingShaftCollarModelDefinitionSchema,
  parse: parseClampingShaftCollarModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
