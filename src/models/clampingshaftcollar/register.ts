import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClampingShaftCollarModelParams } from "./parse-model-string"
import { clampingShaftCollarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clampingshaftcollar",
  schema: clampingShaftCollarModelDefinitionSchema,
  parse: parseClampingShaftCollarModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseClampingShaftCollarModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
