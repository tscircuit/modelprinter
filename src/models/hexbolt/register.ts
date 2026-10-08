import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { hexBoltModelDefinitionSchema } from "./schema"
import { parseHexBoltModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "hexbolt",
  schema: hexBoltModelDefinitionSchema,
  parse: parseHexBoltModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseHexBoltModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
