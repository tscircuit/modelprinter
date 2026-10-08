import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCompressionSpringModelParams } from "./parse-model-string"
import { compressionSpringModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "compressionspring",
  schema: compressionSpringModelDefinitionSchema,
  parse: parseCompressionSpringModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseCompressionSpringModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
