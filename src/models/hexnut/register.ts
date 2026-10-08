import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHexNutModelParams } from "./parse-model-string"
import { hexNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hexnut",
  schema: hexNutModelDefinitionSchema,
  parse: parseHexNutModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseHexNutModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
