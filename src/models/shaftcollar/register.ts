import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShaftCollarModelParams } from "./parse-model-string"
import { shaftCollarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "shaftcollar",
  schema: shaftCollarModelDefinitionSchema,
  parse: parseShaftCollarModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseShaftCollarModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
