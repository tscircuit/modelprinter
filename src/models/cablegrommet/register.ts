import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCableGrommetModelParams } from "./parse-model-string"
import { cableGrommetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cablegrommet",
  schema: cableGrommetModelDefinitionSchema,
  parse: parseCableGrommetModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseCableGrommetModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
