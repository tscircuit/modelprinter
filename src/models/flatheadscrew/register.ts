import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlatHeadScrewModelParams } from "./parse-model-string"
import { flatHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flatheadscrew",
  schema: flatHeadScrewModelDefinitionSchema,
  parse: parseFlatHeadScrewModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseFlatHeadScrewModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
