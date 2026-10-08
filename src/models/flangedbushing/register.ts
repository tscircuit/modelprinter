import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangedBushingModelParams } from "./parse-model-string"
import { flangedBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangedbushing",
  schema: flangedBushingModelDefinitionSchema,
  parse: parseFlangedBushingModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseFlangedBushingModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
