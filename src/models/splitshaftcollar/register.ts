import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplitShaftCollarModelString } from "./parse-model-string"
import { splitShaftCollarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splitshaftcollar",
  schema: splitShaftCollarModelDefinitionSchema,
  parse: parseSplitShaftCollarModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
