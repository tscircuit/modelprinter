import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseButtonScrewModelParams } from "./parse-model-string"
import { buttonScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "buttonscrew",
  schema: buttonScrewModelDefinitionSchema,
  parse: parseButtonScrewModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseButtonScrewModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
