import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePanScrewModelParams } from "./parse-model-string"
import { panScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "panscrew",
  schema: panScrewModelDefinitionSchema,
  parse: parsePanScrewModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parsePanScrewModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
